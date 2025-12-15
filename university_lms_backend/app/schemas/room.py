"""
Room Schema (Production)
------------------------
Pydantic schemas for the Room model, used for validation and serialization of physical or virtual classroom resources.

- No sample, demo, or test code.
- Follows global schema conventions for unified LMS architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RoomBase(BaseModel):
    """
    Shared base schema for room creation, update, and read.
    """
    name: str = Field(..., description="Room name or number")
    location: Optional[str] = Field(None, description="Location or building identifier for the room")
    capacity: Optional[int] = Field(None, description="Maximum occupancy of the room")
    type: Optional[str] = Field(None, description="Room type (e.g., 'lecture', 'lab', 'virtual')")
    status: Optional[str] = Field("active", description="Room status (active/inactive)")

class RoomCreate(RoomBase):
    """
    Schema for creating a new room entry.
    """
    pass

class RoomUpdate(BaseModel):
    """
    Fields allowed for updating a room (all optional).
    """
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    type: Optional[str] = None
    status: Optional[str] = None

class RoomInDBBase(RoomBase):
    """
    Fields provided by the DB for internal/response use.
    """
    room_id: int = Field(..., description="Primary key for the room record")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Room(RoomInDBBase):
    """
    Schema for API reading of room records.
    """
    pass

class RoomInDB(RoomInDBBase):
    """
    Internal DB schema for room records.
    """
    pass