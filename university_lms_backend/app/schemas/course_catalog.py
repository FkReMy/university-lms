"""
CourseCatalog Schema (Production)
---------------------------------
Pydantic schemas for the CourseCatalog model, governing request validation and response serialization for university courses.

- No sample, demo, or test code.
- Follows global schema conventions for architectural consistency.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CourseCatalogBase(BaseModel):
    """
    Shared fields for create/update/read of course catalog entries.
    """
    title: str = Field(..., description="Full name of the course")
    code: str = Field(..., description="Unique course code, e.g., CS101")
    description: Optional[str] = Field(None, description="Textual course description")
    credit_hours: Optional[int] = Field(None, description="Credit hours assigned to this course")
    department_id: Optional[int] = Field(None, description="Related department for this course")
    status: Optional[str] = Field("active", description="Course status (active/inactive)")

class CourseCatalogCreate(CourseCatalogBase):
    """
    Schema for creating a catalog course.
    """
    pass

class CourseCatalogUpdate(BaseModel):
    """
    Fields eligible to update for course catalog entries (all optional).
    """
    title: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    credit_hours: Optional[int] = None
    department_id: Optional[int] = None
    status: Optional[str] = None

class CourseCatalogInDBBase(CourseCatalogBase):
    """
    Common fields from DB or for API response.
    """
    course_catalog_id: int = Field(..., description="Primary key for course catalog entry")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class CourseCatalog(CourseCatalogInDBBase):
    """
    Schema for API reading course catalog records.
    """
    pass

class CourseCatalogInDB(CourseCatalogInDBBase):
    """
    Internal DB schema for course catalog records.
    """
    pass