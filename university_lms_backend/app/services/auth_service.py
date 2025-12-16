"""
Auth Service (Production)
-------------------------
Service layer for authentication operations including login, token management,
and password reset functionality.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from fastapi import HTTPException, status, BackgroundTasks, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta

from app.schemas.auth import (
    AuthTokenResponse,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthPasswordChangeRequest,
    AuthPasswordResetRequest,
    AuthPasswordResetConfirmRequest
)
from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.database import get_db
from app.repositories.user_repo import UserRepository


class AuthService:
    """
    Handles authentication and authorization business logic.
    """

    @staticmethod
    async def login(form_data: OAuth2PasswordRequestForm, db: Session) -> AuthTokenResponse:
        """
        Authenticate user with username and password, return JWT tokens.
        """
        # Look up user by username
        user = UserRepository.get_by_username(db, form_data.username)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify password
        if not verify_password(form_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )
        
        # Update last login timestamp
        UserRepository.update(db, user.user_id, last_login=datetime.utcnow())
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRES_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.user_id)},
            expires_delta=access_token_expires
        )
        
        # Create refresh token
        refresh_token_expires = timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRES_MINUTES)
        refresh_token = create_access_token(
            data={"sub": str(user.user_id), "type": "refresh"},
            expires_delta=refresh_token_expires
        )
        
        return AuthTokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    @staticmethod
    async def refresh_token(refresh_request: AuthRefreshRequest) -> AuthRefreshResponse:
        """
        Refresh access token using a valid refresh token.
        """
        # TODO: Implement token refresh logic
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Token refresh endpoint not yet implemented"
        )

    @staticmethod
    async def logout(user, background_tasks: Optional[BackgroundTasks] = None):
        """
        Logout user by invalidating their tokens.
        """
        # TODO: Implement logout logic (invalidate refresh tokens)
        pass

    @staticmethod
    async def change_password(user, change_request: AuthPasswordChangeRequest, db: Session):
        """
        Change password for authenticated user.
        """
        # Verify old password
        user_obj = UserRepository.get_by_id(db, user.user_id)
        if not user_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not verify_password(change_request.old_password, user_obj.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect old password"
            )
        
        # Hash and update new password
        new_password_hash = get_password_hash(change_request.new_password)
        UserRepository.update(db, user.user_id, password_hash=new_password_hash)
        
        return {"message": "Password changed successfully"}

    @staticmethod
    async def request_password_reset(reset_request: AuthPasswordResetRequest):
        """
        Initiate password reset process by sending reset email.
        """
        # TODO: Implement password reset request logic
        pass

    @staticmethod
    async def confirm_password_reset(confirm_request: AuthPasswordResetConfirmRequest):
        """
        Complete password reset using token from email.
        """
        # TODO: Implement password reset confirmation logic
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Password reset confirmation endpoint not yet implemented"
        )
