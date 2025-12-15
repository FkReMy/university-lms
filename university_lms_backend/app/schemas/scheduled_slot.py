"""
ScheduledSlot Schema (Production)
---------------------------------
Pydantic schemas for the ScheduledSlot model, used to represent scheduled events or class time slots within the LMS.

- No sample, demo, or test code.
- Adheres to system-wide schema conventions for maintainability and unity.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ScheduledSlotBase(BaseModel):
    """
    Shared base schema for scheduled slot creation, update, and read.
    """
    course_offering_id: int = Field(..., description="ID of the course offering associated with this slot")
    room_id: Optional[int] = Field(None, description="ID of the scheduled room (optional for virtual events)")
    start_time: datetime = Field(..., description="Start date/time of the scheduled slot")
    end_time: datetime = Field(..., description="End date/time of the scheduled slot")
    type: Optional[str] = Field(None, description="Slot type, e.g., 'lecture', 'lab', 'exam'")
    status: Optional[str] = Field("scheduled", description="Slot status (e.g., 'scheduled', 'cancelled')")

class ScheduledSlotCreate(ScheduledSlotBase):
    """
    Schema for creating scheduled slots.
    """
    pass

class ScheduledSlotUpdate(BaseModel):
    """
    Fields allowed for updating a scheduled slot (all optional).
    """
    course_offering_id: Optional[int] = None
    room_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    type: Optional[str] = None
    status: Optional[str] = None

class ScheduledSlotInDBBase(ScheduledSlotBase):
    """
    Fields provided by DB for scheduled slot response/internal use.
    """
    slot_id: int = Field(..., description="Primary key for the scheduled slot")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ScheduledSlot(ScheduledSlotInDBBase):
    """
    Schema for API reading of scheduled slot records.
    """
    pass

class ScheduledSlotInDB(ScheduledSlotInDBBase):
    """
    Internal DB schema for scheduled slot records.
    """
    pass