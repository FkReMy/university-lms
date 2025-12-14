"""
Notifications API Router (Production)
-------------------------------------
Handles user notifications delivery, read-status, and management in University LMS.

- All logic is production-ready (no sample/demo).
- Uses unified notification services and schemas.
- Role-policy: Users may access only their own notifications. Admin can send system-wide notices.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationUpdate,
)
from app.services.notification_service import NotificationService
from app.core.auth import get_current_user

router = APIRouter()

@router.get(
    "/",
    response_model=List[NotificationResponse],
    summary="List all notifications for the current user"
)
async def list_notifications(current_user=Depends(get_current_user)):
    """
    User can fetch all of their notifications, newest first.
    """
    return await NotificationService.list_notifications(user=current_user)

@router.post(
    "/",
    response_model=NotificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Send a notification (admin only)"
)
async def send_notification(
    notification: NotificationCreate,
    current_user=Depends(get_current_user),
):
    """
    Admin can send notification to a user or broadcast to multiple.
    """
    return await NotificationService.send_notification(notification=notification, user=current_user)

@router.patch(
    "/{notification_id}",
    response_model=NotificationResponse,
    summary="Mark notification as read or update its state"
)
async def update_notification(
    notification_id: str,
    notification_update: NotificationUpdate,
    current_user=Depends(get_current_user),
):
    """
    Mark the notification as read or update its content/status. 
    Only the owner or admin may do so.
    """
    return await NotificationService.update_notification(
        notification_id=notification_id,
        notification_update=notification_update,
        user=current_user
    )

@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a notification (owner or admin)"
)
async def delete_notification(
    notification_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a notification. Owner or admin only.
    """
    await NotificationService.delete_notification(notification_id=notification_id, user=current_user)
    return None