"""
Users API Router (Production)
-----------------------------
Handles user CRUD, profile management, and admin functions for the University LMS backend.

- All endpoints leverage unified global schemas and services.
- Access policy: users may see/update their own info; admins may manage all users.
- No demos, samples, or test code.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.user import (
    User as UserResponse,
    UserCreate,
    UserUpdate,
)
from app.schemas.auth import AdminPasswordResetRequest
from app.services.user_service import UserService
from app.core.auth import get_current_user
from app.core.database import get_db
from app.core.security import get_password_hash
from app.repositories.user_repo import UserRepository

router = APIRouter()


@router.get(
    "/",
    response_model=List[UserResponse],
    summary="List all users (admin only)",
)
async def list_users(
    search: Optional[str] = None,
    current_user=Depends(get_current_user),
):
    """
    List all users. Admins only.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return UserService.list_users(search=search)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user's profile"
)
async def get_me(current_user=Depends(get_current_user)):
    """
    Retrieve the profile of the currently authenticated user.
    """
    return UserService.get_by_id(current_user.user_id)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get a user by ID (admin or self)"
)
async def get_user(
    user_id: int,
    current_user=Depends(get_current_user),
):
    """
    Fetch profile for given user_id (admin or self).
    """
    if not (current_user.is_admin or current_user.user_id == user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")
    return UserService.get_by_id(user_id)


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a user (admin only)",
)
async def create_user(
    user_create: UserCreate,
    current_user=Depends(get_current_user),
):
    """
    Admin-only: Create a new user account.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return UserService.create(user_create)


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update own user info"
)
async def update_me(
    user_update: UserUpdate,
    current_user=Depends(get_current_user),
):
    """
    User may update their own profile.
    """
    return UserService.update(current_user.user_id, user_update)


@router.patch(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update a user by ID (admin or self)"
)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user=Depends(get_current_user),
):
    """
    Admin may update any user, or user may update own profile.
    """
    if not (current_user.is_admin or current_user.user_id == user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")
    return UserService.update(user_id, user_update)


@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
    summary="Update user status (admin only)"
)
async def update_user_status(
    user_id: int,
    is_active: bool,
    current_user=Depends(get_current_user),
):
    """
    Admin can activate, deactivate, or suspend a user account.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return UserService.set_status(user_id, is_active)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete (deactivate) a user (admin only)"
)
async def delete_user(
    user_id: int,
    current_user=Depends(get_current_user),
):
    """
    Admin-only: Delete or deactivate a user (soft-delete).
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    UserService.delete(user_id)
    return None


@router.post(
    "/{user_id}/reset-password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Reset a user's password (admin only)"
)
async def reset_user_password(
    user_id: int,
    reset_request: AdminPasswordResetRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin-only: Reset a user's password without needing to know the old password.
    The admin cannot view the actual password, only set a new one.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    
    # Check if user exists
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Hash and update the new password
    new_password_hash = get_password_hash(reset_request.new_password)
    UserRepository.update(db, user_id, password_hash=new_password_hash)
    
    return None