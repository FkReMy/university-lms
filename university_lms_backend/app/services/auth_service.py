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
        
        # Get role name if available
        role_name = None
        if user.role:
            role_name = user.role.name if hasattr(user.role, 'name') else str(user.role)
        
        # Import UserInfo schema
        from app.schemas.auth import UserInfo
        
        # Create user info
        user_info = UserInfo(
            user_id=user.user_id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            role=role_name,
            is_active=user.is_active
        )
        
        return AuthTokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=user_info
        )

    @staticmethod
    async def register(user_data, db: Session) -> AuthTokenResponse:
        """
        Register a new user and return JWT tokens for automatic login.
        """
        from app.schemas.user import UserCreate
        from app.schemas.auth import UserInfo
        
        # Check if username already exists
        existing_user = UserRepository.get_by_username(db, user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email already exists
        existing_email = UserRepository.get_by_email(db, user_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Split full_name into first_name and last_name
        full_name = user_data.full_name.strip()
        name_parts = full_name.split(None, 1)  # Split on first whitespace
        first_name = name_parts[0] if name_parts else full_name
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        # Hash the password
        password_hash = get_password_hash(user_data.password)
        
        # Create the user with default "Student" role
        # First, get the Student role ID
        from app.repositories.role_repo import RoleRepository
        student_role = RoleRepository.get_by_name(db, "Student")
        role_id = student_role.role_id if student_role else None
        
        # Create user
        new_user = UserRepository.create(
            db,
            username=user_data.username,
            email=user_data.email,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name,
            phone=user_data.phone,
            is_active=True,
            is_verified=False,
            role_id=role_id
        )
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRES_MINUTES)
        access_token = create_access_token(
            data={"sub": str(new_user.user_id)},
            expires_delta=access_token_expires
        )
        
        # Create refresh token
        refresh_token_expires = timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRES_MINUTES)
        refresh_token = create_access_token(
            data={"sub": str(new_user.user_id), "type": "refresh"},
            expires_delta=refresh_token_expires
        )
        
        # Get role name
        role_name = None
        if new_user.role:
            role_name = new_user.role.name if hasattr(new_user.role, 'name') else str(new_user.role)
        
        # Create user info
        user_info = UserInfo(
            user_id=new_user.user_id,
            username=new_user.username,
            email=new_user.email,
            full_name=new_user.full_name,
            role=role_name,
            is_active=new_user.is_active
        )
        
        return AuthTokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=user_info
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
