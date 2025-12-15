"""
Academic Session Schema (Production)
------------------------------------
Pydantic schemas for AcademicSession model, used for request validation and response serialization.

- No sample, demo, or test code.
- Follows the global schema conventions for system-wide consistency.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class AcademicSessionBase(BaseModel):
    """
    Shared fields for create/update/read operations on academic sessions.
    """
    name: str = Field(..., example="2025/2026 Academic Year")
    code: Optional[str] = Field(None, example="2025-26")
    start_date: date = Field(..., example="2025-09-01")
    end_date: date = Field(..., example="2026-06-30")
    description: Optional[str] = Field(None, example="Main session for academic year 2025-26")

class AcademicSessionCreate(AcademicSessionBase):
    """
    Fields required for creation of academic session.
    """
    pass

class AcademicSessionUpdate(BaseModel):
    """
    Fields allowed for academic session updates (all optional).
    """
    name: Optional[str] = None
    code: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None

class AcademicSessionInDBBase(AcademicSessionBase):
    """
    Base fields returned from the database for academic sessions.
    """
    session_id: int

    class Config:
        orm_mode = True

class AcademicSession(AcademicSessionInDBBase):
    """
    Full schema for reading an academic session.
    """
    pass

class AcademicSessionInDB(AcademicSessionInDBBase):
    """
    Internal schema for database use only.
    """
    pass