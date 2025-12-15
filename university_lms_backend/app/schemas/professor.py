"""
Professor Schema (Production)
-----------------------------
Pydantic schemas for Professor model, used for API validation and serialization of professor (faculty) records.

- No sample, demo, or test code.
- Follows system-wide Pydantic schema conventions for LMS unification.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProfessorBase(BaseModel):
    """
    Shared schema fields for professor entity (create/update/read).
    """
    user_id: int = Field(..., description="User ID that links to professor's account")
    department_id: Optional[int] = Field(None, description="Department where professor belongs")
    title: Optional[str] = Field(None, description="Academic or job title (e.g., 'Dr.', 'Professor')")
    office: Optional[str] = Field(None, description="Office location or number")
    bio: Optional[str] = Field(None, description="Professor's biography or summary")
    status: Optional[str] = Field("active", description="Account or employment status")

class ProfessorCreate(ProfessorBase):
    """
    Fields required for professor creation.
    """
    pass

class ProfessorUpdate(BaseModel):
    """
    Fields for professor update (all optional).
    """
    user_id: Optional[int] = None
    department_id: Optional[int] = None
    title: Optional[str] = None
    office: Optional[str] = None
    bio: Optional[str] = None
    status: Optional[str] = None

class ProfessorInDBBase(ProfessorBase):
    """
    Fields typically returned by DB for professor records.
    """
    professor_id: int = Field(..., description="Primary key for the professor entity")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Professor(ProfessorInDBBase):
    """
    Schema for API reading of professor records.
    """
    pass

class ProfessorInDB(ProfessorInDBBase):
    """
    Schema for DB/internal reading of professor records.
    """
    pass