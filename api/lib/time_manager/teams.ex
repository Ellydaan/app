defmodule TimeManager.Teams do
  @moduledoc """
  The Teams context.
  """

  import Ecto.Query, warn: false
  alias TimeManager.Repo

  alias TimeManager.Teams.Team
  alias TimeManager.Users.User
  alias TimeManager.WorkingTime.WorkingTimes

  @doc """
  Returns the list of teams.

  ## Examples

      iex> list_teams()
      [%Team{}, ...]

  """
  def list_teams do
    Repo.all(Team)
    |> Repo.preload([:members, :manager])
  end

  def list_teams(params) do
    manager_id = params["manager_id"]
    Repo.all(from t in Team, where: t.manager_id == ^manager_id)
    |>Repo.preload(:members)
  end

  @doc """
  Gets a single team.

  Raises `Ecto.NoResultsError` if the Team does not exist.

  ## Examples

      iex> get_team!(123)
      %Team{}

      iex> get_team!(456)
      ** (Ecto.NoResultsError)

  """
  def get_team!(id), do: Repo.get!(Team, id)

  @doc """
  Creates a team.

  ## Examples

      iex> create_team(%{field: value})
      {:ok, %Team{}}

      iex> create_team(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_team(attrs \\ %{}) do
    %Team{}
    |> Team.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a team.

  ## Examples

      iex> update_team(team, %{field: new_value})
      {:ok, %Team{}}

      iex> update_team(team, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_team(%Team{} = team, attrs) do
    team
    |> Team.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a team.

  ## Examples

      iex> delete_team(team)
      {:ok, %Team{}}

      iex> delete_team(team)
      {:error, %Ecto.Changeset{}}

  """
  def delete_team(%Team{} = team) do
    Repo.delete(team)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking team changes.

  ## Examples

      iex> change_team(team)
      %Ecto.Changeset{data: %Team{}}

  """
  def change_team(%Team{} = team, attrs \\ %{}) do
    Team.changeset(team, attrs)
  end

  def add_member(%Team{} = team, %User{} = user) do
    team = Repo.preload(team, :members)

    unless Enum.any?(team.members, fn member -> member.id == user.id end) do
      now = NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second)

      Repo.insert_all("team_members", [
        %{team_id: team.id, user_id: user.id, inserted_at: now, updated_at: now}
      ])
      {:ok, %{team | members: [user | team.members]}}
    else
      {:ok, team}
    end
  end

  def remove_member(%Team{} = team, %User{} = user) do
    team
    |> Repo.preload(:members)
    |> Ecto.Changeset.change()
    |> Ecto.Changeset.put_assoc(:members, Enum.filter(team.members, &(&1.id != user.id)))
    |> Repo.update()
  end

  def list_team_members(team_id) do
    Team
    |> where([t], t.id == ^team_id)
    |> preload(:members)
    |> Repo.one()
    |> Map.get(:members, [])
  end

  def calculate_working_hours(team_id, start_date, end_date) do

    {:ok, start_date} = Date.from_iso8601(start_date)
    {:ok, start_date_time} = NaiveDateTime.from_iso8601("#{Date.to_string(start_date)}T00:00:00Z")
    {:ok, end_date} = Date.from_iso8601(end_date)
    {:ok, end_date_time} = NaiveDateTime.from_iso8601("#{Date.to_string(end_date)}T23:59:59Z")

    query = from t in Team,
                 join: tm in "team_members", on: tm.team_id == t.id,
                 join: w in WorkingTimes, on: w.user_id == tm.user_id,
                 where: t.id == ^team_id,
                 where: w.start >= ^start_date_time and w."end" <= ^end_date_time,
                 select: %{
                   date: fragment("DATE(?) at time zone 'UTC'", w.start),
                   duration: fragment("EXTRACT(epoch FROM (? - ?)) / 3600", w.'end', w.start)
                 }

    with {:ok, records} <- {:ok, Repo.all(query)} do
      daily_avg = calculate_daily_average(records)
      weekly_avg = calculate_weekly_average(records)

      {:ok, %{
        daily_average: daily_avg,
        weekly_average: weekly_avg
      }}
    end
  end

  defp calculate_daily_average(records) do
    average = records
              |> Enum.group_by(& &1.date)
              |> Enum.map(fn {_date, hours} ->
      hours
      |> Enum.map(fn hour ->
        case hour.duration do
          %Decimal{} = d -> Decimal.to_float(d)
          nil -> 0.0
          duration when is_number(duration) -> duration
          _other -> 0.0
        end
      end)
      |> Enum.sum()
    end)
              |> case do
                   [] -> 0.0
                   hours -> Enum.sum(hours) / length(hours)
                 end
    format_duration(average)
  end

  defp calculate_weekly_average(records) do
    average = records
              |> Enum.group_by(& Date.beginning_of_week(&1.date))
              |> Enum.map(fn {_week, hours} ->
      hours
      |> Enum.map(fn hour ->
        case hour.duration do
          %Decimal{} = d -> Decimal.to_float(d)
          nil -> 0.0
          duration when is_number(duration) -> duration
          _other -> 0.0
        end
      end)
      |> Enum.sum()
    end)
              |> case do
                   [] -> 0.0
                   hours -> Enum.sum(hours) / length(hours)
                 end
    format_duration(average)
  end

  defp format_duration(hours) do
    rounded_hours = Float.round(hours, 1)

    hours_part = trunc(rounded_hours)
    minutes_part = trunc((rounded_hours - hours_part) * 60)

    "#{hours_part}h#{minutes_part}m"
  end
end
