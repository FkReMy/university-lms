"""
Notification Schema (Production)
-------------------------------
Pydantic schemas for Notification model, used for API validation and serialization of notifications sent to users.

- No sample, demo, or test code.
- Follows global schema conventions for unified, maintainable architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    """
    Shared base schema for notification entity creation, update, and read.
    """
    user_id: int = Field(..., description="User who receives the notification")
    message: str = Field(..., description="Content of the notification message")
    type: Optional[str] = Field(None, description="Type/category of notification (e.g., 'system', 'assignment', 'grade')")
    read: Optional[bool] = Field(False, description="Read/unread status of the notification")
    url: Optional[str] = Field(None, description="Related URL for further action or context")

class NotificationCreate(NotificationBase):
    """
    Schema for creating a new notification.
    """
    pass

class NotificationUpdate(BaseModel):
    """
    Fields for updating a notification (all optional).
    """
    user_id: Optional[int] = None
    message: Optional[str] = None
    type: Optional[str] = None
    read: Optional[bool] = None
    url: Optional[str] = None

class NotificationInDBBase(NotificationBase):
    """
    DB/response fields for notifications.
    """
    notification_id: int = Field(..., description="Primary key for the notification entry")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Notification(NotificationInDBBase):
    """
    Schema for API reading of notifications.
    """
    pass

class NotificationInDB(NotificationInDBBase):
    """
    Schema for returning notifications internally from DB.
    """
    pass