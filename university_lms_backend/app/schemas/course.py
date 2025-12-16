"""
Course Schema (Production)
--------------------------
Pydantic schemas for course catalog and course-related entities.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CourseBase(BaseModel):
    """Base schema for course catalog entries"""
    course_code: str = Field(..., description="Unique course code")
    course_name: str = Field(..., description="Course name")
    description: Optional[str] = Field(None, description="Course description")
    credits: Optional[int] = Field(None, description="Credit hours")


class CourseCreate(CourseBase):
    """Schema for creating a course"""
    pass


class CourseUpdate(BaseModel):
    """Schema for updating a course"""
    course_name: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[int] = None


class CourseCatalogResponse(CourseBase):
    """Response schema for course catalog"""
    course_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CourseResponse(CourseBase):
    """Response schema for course details"""
    course_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
