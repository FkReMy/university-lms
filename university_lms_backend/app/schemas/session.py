"""
Academic Session Schema (Production)
------------------------------------
Pydantic schemas for academic session entities.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class AcademicSessionBase(BaseModel):
    """Base schema for academic sessions"""
    session_name: str = Field(..., description="Session name (e.g., Fall 2024)")
    start_date: date = Field(..., description="Session start date")
    end_date: date = Field(..., description="Session end date")


class AcademicSessionCreate(AcademicSessionBase):
    """Schema for creating an academic session"""
    pass


class AcademicSessionUpdate(BaseModel):
    """Schema for updating an academic session"""
    session_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class AcademicSessionResponse(AcademicSessionBase):
    """Response schema for academic sessions"""
    session_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
