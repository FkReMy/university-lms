"""
University LMS Backend - ASGI Application Entrypoint (Production)
-----------------------------------------------------------------
This file provides the canonical ASGI application object for use by
ASGI servers/process managers (e.g., Uvicorn, Gunicorn, Hypercorn) in
production deployments.

- Loads configuration and application context.
- Uses only global and unified settings/components.
- No samples, demos, or test/dev code.
- Ensures consistent entrypoint for all app servers.

Usage:
    uvicorn app.asgi:app --host 0.0.0.0 --port 8000
"""

import os
from fastapi import FastAPI

from app.main import create_app

# Optionally, manage environment-specific settings
ENVIRONMENT = os.getenv("ENVIRONMENT", "production")

# Create the FastAPI application using the global unified creator
app: FastAPI = create_app(environment=ENVIRONMENT)

# The object `app` is what all ASGI servers will serve