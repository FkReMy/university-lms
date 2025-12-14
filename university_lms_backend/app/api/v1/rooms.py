"""
Rooms API Router (Production)
-----------------------------
Manages classroom/meeting room records within the University LMS.

- Full production logic, no samples or demo code.
- Only uses global schemas/services and production-grade validation.
- Admin can create/update/delete rooms; all users can view.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.room import (
    RoomCreate,
    RoomUpdate,
    RoomResponse,
)
from app.services.room_service import RoomService
from app.core.auth import get_current_user

router = APIRouter()

@router.get(
    "/",
    response_model=List[RoomResponse],
    summary="List all rooms"
)
async def list_rooms(
    current_user=Depends(get_current_user)
):
    """
    List all rooms available in the system.
    """
    return await RoomService.list_rooms(user=current_user)

@router.get(
    "/{room_id}",
    response_model=RoomResponse,
    summary="Get a room by ID"
)
async def get_room(
    room_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve a specific room by room ID.
    """
    return await RoomService.get_room_by_id(room_id=room_id, user=current_user)

@router.post(
    "/",
    response_model=RoomResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new room (admin only)"
)
async def create_room(
    room: RoomCreate,
    current_user=Depends(get_current_user),
):
    """
    Admin creates a new room.
    """
    return await RoomService.create_room(room=room, user=current_user)

@router.patch(
    "/{room_id}",
    response_model=RoomResponse,
    summary="Update a room (admin only)"
)
async def update_room(
    room_id: str,
    room_update: RoomUpdate,
    current_user=Depends(get_current_user),
):
    """
    Admin updates room details.
    """
    return await RoomService.update_room(room_id=room_id, room_update=room_update, user=current_user)

@router.delete(
    "/{room_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a room (admin only)"
)
async def delete_room(
    room_id: str,
    current_user=Depends(get_current_user),
):
    """
    Admin deletes a room by ID.
    """
    await RoomService.delete_room(room_id=room_id, user=current_user)
    return None