#!/bin/bash
# University LMS Backend Wait-for-DB Script (Production)
# ------------------------------------------------------
# Wait until the Postgres DB is accepting connections before continuing.
#
# Usage (from Dockerfile or Compose):
#   ./docker/wait-for-db.sh
#
# Uses POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER from env
# Fails and exits with code 1 after max retries for safety.
# ------------------------------------------------------

MAX_RETRIES=30
RETRY_INTERVAL=2

retry_count=0

echo "Waiting for PostgreSQL to be ready at $POSTGRES_HOST:$POSTGRES_PORT ..."

until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1; do
    retry_count=$((retry_count + 1))
    if [ $retry_count -ge $MAX_RETRIES ]; then
        echo "ERROR: PostgreSQL did not become available after $((MAX_RETRIES * RETRY_INTERVAL)) seconds." >&2
        exit 1
    fi
    sleep $RETRY_INTERVAL
done

echo "PostgreSQL is available."
exit 0