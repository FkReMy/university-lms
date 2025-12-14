"""
Users API Router (Production)
-----------------------------
Handles user CRUD, profile management, and admin functions for the University LMS.

- All endpoints leverage unified schemas/services.
- Role/ownership access policy: users may view/update their own info; admins may manage all users.
- Fully production-ready: no samples, demos, or test code.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
    UserStatusUpdate,
)
from app.services.user_service import UserService
from app.core.auth import get_current_user

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
    List all users in the system (possible filters: search).
    Only admins allowed.
    """
    return await UserService.list_users(search=search, user=current_user)

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user's profile"
)
async def get_me(current_user=Depends(get_current_user)):
    """
    Retrieve the profile of the currently authenticated user.
    """
    return await UserService.get_user_by_id(user_id=current_user.id, user=current_user)

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get a user by ID (admin or owner)"
)
async def get_user(
    user_id: str,
    current_user=Depends(get_current_user),
):
    """
    Fetch profile for given user_id (admin, or self).
    """
    return await UserService.get_user_by_id(user_id=user_id, user=current_user)

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
    Admin-only creation of a new user account.
    """
    return await UserService.create_user(user_create=user_create, user=current_user)

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
    return await UserService.update_user(user_id=current_user.id, user_update=user_update, user=current_user)

@router.patch(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update a user by ID (admin or owner)"
)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user=Depends(get_current_user),
):
    """
    Admin may update any user, or user may update own profile.
    """
    return await UserService.update_user(user_id=user_id, user_update=user_update, user=current_user)

@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
    summary="Update a users status (admin only)"
)

async def update_user_status(
    user_id: str,
    status_update: UserStatusUpdate,
    current_user=Depends(get_current_user),
):
    """
    Admin can activate, deactivate, or suspend a user account.
    """
    return await UserService.update_user_status(user_id=user_id, status_update=status_update, user=current_user)

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete (deactivate) a user (admin only)"
)
async def delete_user(
    user_id: str,
    current_user=Depends(get_current_user),
):
    """
    Admin-only: Delete or deactivate a user (soft-delete recommended).
    """
    await UserService.delete_user(user_id=user_id, user=current_user)
    return None