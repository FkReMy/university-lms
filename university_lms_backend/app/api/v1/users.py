"""
Users API Router (Production Version)
-------------------------------------
Provides user-related API endpoints.
- Uses unified, global schema and naming conventions.
- Avoids sample/demo code.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.security import get_current_active_user, get_db
from app.services.user_service import UserService
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    User as UserResponse,  # Use global schema, not a non-existent UserResponse
)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all users in paginated form.
    """
    return UserService.get_all(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieve a user by their unique ID.
    """
    user = UserService.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new user using provided schema.
    """
    return UserService.create(db, user_in)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing user record.
    """
    user = UserService.update(db, user_id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a user by their unique ID.
    """
    deleted = UserService.delete(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")