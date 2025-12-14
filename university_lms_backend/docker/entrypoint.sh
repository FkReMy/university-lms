#!/bin/bash
# University LMS Backend Entrypoint Script (Production)
# -----------------------------------------------------
# Handles:
#  1. Waiting for the PostgreSQL and Redis containers to be ready.
#  2. Running database migrations (via Alembic) before starting the app.
#  3. Starting the backend FastAPI app via Uvicorn.
#
# This script is intended for use as the final ENTRYPOINT
# in the backend container (overrideable in docker-compose).
# -----------------------------------------------------

set -e

# Wait for DB (Postgres) to be ready
echo "Waiting for Postgres to be ready..."
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1
do
  sleep 2
done
echo "Postgres is available."

# Wait for Redis (optional, skip if not used)
if [ -n "$REDIS_HOST" ]; then
  echo "Waiting for Redis to be ready..."
  until nc -z "$REDIS_HOST" "$REDIS_PORT"; do
    sleep 2
  done
  echo "Redis is available."
fi

# Apply Alembic migrations automatically (production safe, idempotent)
echo "Running Alembic database migrations..."
alembic upgrade head

# Start the backend server (Uvicorn)
echo "Starting FastAPI backend with Uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000