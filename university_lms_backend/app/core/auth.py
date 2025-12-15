"""
Authentication & Authorization Utilities (Production)
-----------------------------------------------------
Central authentication and authorization logic for University LMS backend.

- All endpoints use these functions for user/context validation.
- Implements JWT auth, permission checks, and role hooks.
- Uses ONLY global, production-ready utilities/modules.
- No samples, demos, or dev/test code.
"""

from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from typing import Optional
from app.core.config import settings
from app.models.user import User
from app.core.database import get_db
from app.services.user_service import UserService

def get_token_from_header(request: Request) -> str:
    """
    Extracts the JWT token from the Authorization header.
    Raises if header missing or not Bearer type.
    """
    auth_header: str = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid.",
        )
    return auth_header.split(" ", 1)[1]

def decode_jwt_token(token: str) -> dict:
    """
    Decodes a JWT token using the configured secret and algorithm.
    Raises HTTP 401 on any failure.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
        )

async def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    """
    Retrieves the current authenticated user from the JWT in the Authorization header.
    Raises HTTP 401 or 403 if missing/invalid or inactive.
    """
    token = get_token_from_header(request)
    payload = decode_jwt_token(token)
    user_id: Optional[str] = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload invalid.",
        )
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload invalid.",
        )
    user = UserService.get_by_id(db=db, user_id=user_id_int)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User not active or does not exist.",
        )
    return user

def require_role(required_roles: list):
    """
    Dependency factory to enforce that the current user has one of the given roles.
    Usage: Depends(require_role(["admin", "professor"]))
    """
    async def role_dependency(
        current_user: User = Depends(get_current_user)
    ):
        # User has a single role relationship, not multiple roles
        user_roles = {current_user.role.name} if current_user.role else set()
        if not any(role in user_roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User lacks required role(s): {required_roles}",
            )
        return current_user
    return role_dependency