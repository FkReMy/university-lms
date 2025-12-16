"""
Authentication API Router (Production)
--------------------------------------
Handles secure login, logout, password management, and token refresh for University LMS.

- Uses unified, production-ready schemas and auth logic.
- RBAC and security enforced at all endpoints.
- No samples, demos, or legacy code.
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.schemas.auth import (
    AuthLoginRequest,
    AuthTokenResponse,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthPasswordChangeRequest,
    AuthPasswordResetRequest,
    AuthPasswordResetConfirmRequest
)
from app.services.auth_service import AuthService
from app.core.auth import get_current_user
from app.core.database import get_db

router = APIRouter()

@router.post(
    "/login",
    response_model=AuthTokenResponse,
    summary="Login with username and password",
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Authenticate a user and obtain JWT tokens.
    """
    return await AuthService.login(form_data, db)

@router.post(
    "/refresh",
    response_model=AuthRefreshResponse,
    summary="Refresh authentication tokens"
)
async def refresh_token(refresh_data: AuthRefreshRequest):
    """
    Refresh access and refresh tokens using a valid refresh token.
    """
    return await AuthService.refresh_token(refresh_request=refresh_data)

@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Logout the current user"
)
async def logout(
    current_user=Depends(get_current_user),
    background_tasks: BackgroundTasks = None
):
    """
    Logout by invalidating the user's refresh token.
    """
    await AuthService.logout(user=current_user, background_tasks=background_tasks)
    return None

@router.post(
    "/password/change",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Change current user's password"
)
async def change_password(
    password_data: AuthPasswordChangeRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change password for the current authenticated user.
    """
    await AuthService.change_password(user=current_user, change_request=password_data, db=db)
    return None

@router.post(
    "/password/reset/request",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Request password reset email"
)
async def request_password_reset(
    request_data: AuthPasswordResetRequest
):
    """
    Request a password reset link to be sent to the user's email address.
    """
    await AuthService.request_password_reset(reset_request=request_data)
    return None

@router.post(
    "/password/reset/confirm",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Confirm password reset using token"
)
async def confirm_password_reset(
    reset_data: AuthPasswordResetConfirmRequest
):
    """
    Confirm and process a password reset using the emailed token.
    """
    await AuthService.confirm_password_reset(confirm_request=reset_data)
    return None