defmodule TimeManagerWeb.ClockController do
  use TimeManagerWeb, :controller
  require Logger

  alias TimeManager.Time
  alias TimeManager.Time.Clock

  action_fallback TimeManagerWeb.FallbackController

  def index(conn, params) do
    clocks = Time.list_clocks(params)
    render(conn, :index, clocks: clocks)
  end

  def create(conn, %{"clocks" => clock_params}) do
    clock = Map.put(clock_params, "user_id", conn.params["userID"])
    with {:ok, %Clock{} = clock} <- Time.create_clock(clock) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/clocks/#{clock}")
      |> render(:show, clock: clock)
    end
  end

  def showChartData(conn, _params) do
    data = Time.chart_is_working_users()
    render(conn, :showChartData, data: data)
  end

  def showLastClock(conn, params) do
    clock = Time.get_last_clock(params["userID"])
    if clock == nil do
      conn
      |> put_status(:not_found)
      |> render("error.json", %{error: "Clock not found"})
    end
    render(conn, :show, clock: clock)
  end
end
