#!/bin/bash
# set -e

echo "User running the entrypoint script :\n" $(id)

echo "Checking /workspace permissions"
ls -la

# Function to check if all required env vars are set
check_required_env() {
    local required_vars=("PGHOST" "PGPORT" "PGUSER" "PGPASSWORD" "PGDATABASE")
    local missing_vars=0
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            echo "Error: Required environment variable $var is not set"
            missing_vars=1
        fi
    done
    
    if [[ $missing_vars -eq 1 ]]; then
        exit 1
    fi
}

# Function to wait for postgres
wait_for_postgres() {
    echo "Waiting for PostgreSQL to become available..."
    while ! pg_isready -h $PGHOST -p $PGPORT -U $PGUSER
    do
        echo "$(date) - waiting for database to start"
        sleep 2
    done
    echo "PostgreSQL is available"
}

# Check environment variables
check_required_env

# Wait for PostgreSQL to be ready
wait_for_postgres

# Install hex and rebar first
echo "Installing hex and rebar..."
mix local.hex --force
mix local.rebar --force


# Try to connect to PostgreSQL and handle connection errors
if ! psql -h $PGHOST -p $PGPORT -U $PGUSER -d postgres -c '\l' >/dev/null 2>&1; then
    echo "Error: Could not connect to PostgreSQL server"
    exit 1
fi


# Now that we know postgres is up, get and compile dependencies
echo "Installing mix dependencies..."
mix deps.clean --all
mix deps.get && mix deps.compile

# Database setup
if [[ -z `psql -h $PGHOST -p $PGPORT -U $PGUSER -Atqc "\\list $PGDATABASE"` ]]; then
    echo "Database $PGDATABASE does not exist. Creating..."
    createdb -h $PGHOST -p $PGPORT -U $PGUSER -E UTF8 $PGDATABASE -l en_US.UTF-8 -T template0
    
    echo "Running migrations..."
    if mix ecto.migrate; then
        echo "Migrations completed successfully"
    else
        echo "Error: Migration failed"
        exit 1
    fi
else
    echo "Database $PGDATABASE already exists"
    echo "Running migrations..."
    if mix ecto.migrate; then
        echo "Migrations completed successfully"
    else
        echo "Error: Migration failed"
        exit 1
    fi
fi

# Run seeder only once
echo "Running seeder..."
if mix run priv/repo/seeds.exs; then
    echo "Seeder completed successfully!"
else
    echo "Error: Seeder failed"
    exit 1
fi

echo "Starting Phoenix server..."
exec mix phx.server
