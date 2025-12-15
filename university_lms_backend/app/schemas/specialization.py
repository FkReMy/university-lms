"""
Specialization Schema (Production)
----------------------------------
Pydantic schemas for the Specialization model, used for validation and serialization of majors, minors, or certification specializations.

- No sample, demo, or test code.
- Follows global schema conventions for unified codebase and architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SpecializationBase(BaseModel):
    """
    Shared base schema for specialization creation, update, and read.
    """
    name: str = Field(..., description="Specialization, major, minor, or track name")
    code: Optional[str] = Field(None, description="Unique code for the specialization")
    description: Optional[str] = Field(None, description="Textual description or summary of the specialization")
    department_id: Optional[int] = Field(None, description="Reference to department this specialization belongs to")
    status: Optional[str] = Field("active", description="Status (active/inactive)")

class SpecializationCreate(SpecializationBase):
    """
    Schema for creating a new specialization.
    """
    pass

class SpecializationUpdate(BaseModel):
    """
    Fields allowed for updating a specialization (all optional).
    """
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    department_id: Optional[int] = None
    status: Optional[str] = None

class SpecializationInDBBase(SpecializationBase):
    """
    Fields returned by the DB for specialization records.
    """
    specialization_id: int = Field(..., description="Primary key for the specialization")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Specialization(SpecializationInDBBase):
    """
    Schema for API reading of specialization records.
    """
    pass

class SpecializationInDB(SpecializationInDBBase):
    """
    Internal DB schema for specialization records.
    """
    pass