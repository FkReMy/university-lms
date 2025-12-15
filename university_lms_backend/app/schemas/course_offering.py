"""
CourseOffering Schema (Production)
----------------------------------
Pydantic schemas for CourseOffering model, governing how courses are offered in a specific term/year.

- No sample, demo, or test code.
- Adheres to system-wide schema conventions for consistency and unification.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CourseOfferingBase(BaseModel):
    """
    Shared base schema for course offering creation/update/read.
    """
    course_catalog_id: int = Field(..., description="ID of the related course catalog entry")
    term: str = Field(..., description="Academic term, e.g., 'Fall', 'Spring'")
    year: int = Field(..., description="Academic year for the offering, e.g., 2025")
    instructor_id: Optional[int] = Field(None, description="User ID of primary instructor")
    capacity: Optional[int] = Field(None, description="Maximum number of students allowed")
    status: Optional[str] = Field("active", description="Offering status (active/inactive)")

class CourseOfferingCreate(CourseOfferingBase):
    """
    Creation fields for a new course offering.
    """
    pass

class CourseOfferingUpdate(BaseModel):
    """
    Fields for updating a course offering (all fields optional).
    """
    course_catalog_id: Optional[int] = None
    term: Optional[str] = None
    year: Optional[int] = None
    instructor_id: Optional[int] = None
    capacity: Optional[int] = None
    status: Optional[str] = None

class CourseOfferingInDBBase(CourseOfferingBase):
    """
    Shared base fields for DB/response (read) use.
    """
    course_offering_id: int = Field(..., description="Primary key for the course offering record")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class CourseOffering(CourseOfferingInDBBase):
    """
    Read schema for API serialization.
    """
    pass

class CourseOfferingInDB(CourseOfferingInDBBase):
    """
    Internal DB schema for course offering records.
    """
    pass