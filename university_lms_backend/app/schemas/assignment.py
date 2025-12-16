"""
Assignment Schema (Production)
------------------------------
Pydantic schemas for Assignment model, utilized in LMS core logic for requests/response validation and serialization.

- No sample, demo, or test code.
- Adheres to global schema conventions for system unity.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AssignmentBase(BaseModel):
    """
    Shared base schema for assignments (creation/update/read).
    """
    course_offering_id: int = Field(..., description="Foreign key for the related course offering")
    title: str = Field(..., description="Title of the assignment")
    description: Optional[str] = Field(None, description="Description/details for the assignment")
    due_date: Optional[datetime] = Field(None, description="Assignment due date and time")
    total_points: Optional[float] = Field(100.0, description="Maximum points for the assignment")
    status: Optional[str] = Field("active", description="Status of the assignment (active/archived/etc.)")

class AssignmentCreate(AssignmentBase):
    """
    Schema for assignment creation.
    """
    pass

class AssignmentUpdate(BaseModel):
    """
    Schema for assignment updates (all fields optional).
    """
    course_offering_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    total_points: Optional[float] = None
    status: Optional[str] = None

class AssignmentInDBBase(AssignmentBase):
    """
    Common fields returned by DB for internal/response use.
    """
    assignment_id: int = Field(..., description="Primary key for the assignment")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Assignment(AssignmentInDBBase):
    """
    Schema for reading assignment records.
    """
    pass

class AssignmentResponse(AssignmentInDBBase):
    """
    Response schema returned by API endpoints.
    """
    pass

class AssignmentInDB(AssignmentInDBBase):
    """
    Schema for returning assignment records from DB.
    """
    pass