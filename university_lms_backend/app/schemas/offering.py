"""
Course Offering Schema (Production)
-----------------------------------
Pydantic schemas for course offering entities.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CourseOfferingBase(BaseModel):
    """Base schema for course offerings"""
    course_id: int = Field(..., description="Course ID")
    session_id: int = Field(..., description="Academic session ID")
    professor_id: Optional[int] = Field(None, description="Professor ID")


class CourseOfferingCreate(CourseOfferingBase):
    """Schema for creating a course offering"""
    pass


class CourseOfferingUpdate(BaseModel):
    """Schema for updating a course offering"""
    professor_id: Optional[int] = None
    capacity: Optional[int] = None


class CourseOfferingResponse(CourseOfferingBase):
    """Response schema for course offerings"""
    offering_id: int
    capacity: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
