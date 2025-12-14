"""
Dependency Injection Utilities (Production)
-------------------------------------------
Global, production-grade dependency injectors for use across the University LMS backend.
Use these wherever shared objects or reusable business logic is required.

- Example: Get current user, DB session, permission checks, etc.
- All implementations use unified/global components.
- No sample/demo/legacy logic.
"""

from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user as global_get_current_user

def get_db_session() -> Session:
    """
    Provides a DB session used throughout the application (production safe).
    Use as a dependency: Depends(get_db_session)
    """
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

async def get_current_user(request: Request = None):
    """
    Production-safe dependency for retrieving the current authenticated user.
    May be used with custom injected logic or to override the user in testing.
    """
    return await global_get_current_user(request)