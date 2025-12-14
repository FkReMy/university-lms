#!/bin/bash
# University LMS Backend - Test Runner (Production Ready)
# -------------------------------------------------------
# Runs all unit and integration tests for the backend app.
#
# Ensures:
#   - No sample or demo logic is executed
#   - Tests cover only production-ready, real code paths
#   - Reports coverage summary (can be integrated with CI/CD pipeline)
#
# Usage:
#   ./scripts/test.sh
#
# Environment:
#   Expects a working .env with all secrets set, and test db/migrations applied.
#   Requires pytest, pytest-cov installed in your environment/container.
#
# Exits with the corresponding result code.

set -euo pipefail

echo "Running University LMS backend tests..."

# Activate python virtualenv if present
if [ -f ".venv/bin/activate" ]; then
  source .venv/bin/activate
fi

# Run pytest with coverage flags, only test code (no demo/sample folders)
pytest --cov=app --cov-report=term --cov-report=xml --cov-fail-under=90 app/tests

exit_code=$?
if [ $exit_code -eq 0 ]; then
  echo "All tests passed and coverage target met."
else
  echo "Some tests failed or coverage is insufficient. See details above."
fi

exit $exit_code