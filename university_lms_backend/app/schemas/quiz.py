"""
Quiz Schema (Production)
------------------------
Pydantic schemas for Quiz model, used for validation and serialization of quizzes associated with courses.

- No sample, demo, or test code.
- Follows global schema conventions for universal system architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuizBase(BaseModel):
    """
    Shared base schema for quiz creation, update, and read.
    """
    course_offering_id: int = Field(..., description="ID of the related course offering for the quiz")
    title: str = Field(..., description="Quiz title")
    description: Optional[str] = Field(None, description="Description or instructions for the quiz")
    due_date: Optional[datetime] = Field(None, description="Date/time the quiz is due")
    duration_minutes: Optional[int] = Field(None, description="The time allowed for the quiz in minutes")
    total_points: Optional[float] = Field(100.0, description="Maximum available points")
    status: Optional[str] = Field("active", description="Quiz status (active/inactive/archived/etc.)")

class QuizCreate(QuizBase):
    """
    Schema for quiz creation.
    """
    pass

class QuizUpdate(BaseModel):
    """
    All fields are optional for patch semantics.
    """
    course_offering_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    total_points: Optional[float] = None
    status: Optional[str] = None

class QuizInDBBase(QuizBase):
    """
    Common fields supplied by DB for Quiz.
    """
    quiz_id: int = Field(..., description="Primary key for the quiz")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Quiz(QuizInDBBase):
    """
    Schema for API reading quiz records.
    """
    pass

class QuizResponse(QuizInDBBase):
    """
    Response schema returned by API endpoints.
    """
    pass

class QuizInDB(QuizInDBBase):
    """
    Internal DB schema for quiz records.
    """
    pass