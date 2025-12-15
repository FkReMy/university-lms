"""
SectionGroup Schema (Production)
-------------------------------
Pydantic schemas for SectionGroup model, organizing students into subgroups within a course offering (e.g., labs, tutorials, project teams).

- No sample, demo, or test code.
- Follows global schema conventions for unified LMS architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SectionGroupBase(BaseModel):
    """
    Shared schema fields for section group creation, update, and read.
    """
    course_offering_id: int = Field(..., description="ID of the course offering this group belongs to")
    name: str = Field(..., description="Name of the section group (e.g., 'Lab Group A')")
    description: Optional[str] = Field(None, description="Section group description or details")
    max_size: Optional[int] = Field(None, description="Maximum number of students in this group")
    status: Optional[str] = Field("active", description="Status of the group (active/inactive)")

class SectionGroupCreate(SectionGroupBase):
    """
    Fields required to create a section group.
    """
    pass

class SectionGroupUpdate(BaseModel):
    """
    Fields allowed for updating a section group (all optional).
    """
    course_offering_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    max_size: Optional[int] = None
    status: Optional[str] = None

class SectionGroupInDBBase(SectionGroupBase):
    """
    Fields returned by DB for section group record.
    """
    section_group_id: int = Field(..., description="Primary key for section group")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class SectionGroup(SectionGroupInDBBase):
    """
    Schema for API reading of section group records.
    """
    pass

class SectionGroupInDB(SectionGroupInDBBase):
    """
    Internal DB schema for section group records.
    """
    pass