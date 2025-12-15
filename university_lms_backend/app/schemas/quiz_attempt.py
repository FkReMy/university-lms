"""
QuizAttempt Schema (Production)
-------------------------------
Pydantic schemas for the QuizAttempt model, used for API validation and serialization of student quiz attempts.

- No sample, demo, or test code.
- Adheres to global schema conventions for unified LMS architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuizAttemptBase(BaseModel):
    """
    Shared schema for quiz attempt creation, update, and read.
    """
    quiz_id: int = Field(..., description="ID of the related quiz")
    student_id: int = Field(..., description="ID of the student attempting the quiz")
    start_time: Optional[datetime] = Field(None, description="Time when the attempt started")
    end_time: Optional[datetime] = Field(None, description="Time when the attempt ended")
    score: Optional[float] = Field(None, description="Score achieved in this attempt")
    status: Optional[str] = Field("in_progress", description="Status (e.g., in_progress, completed, graded)")
    feedback: Optional[str] = Field(None, description="Instructor or system feedback for this attempt")

class QuizAttemptCreate(QuizAttemptBase):
    """
    Fields required to create a new quiz attempt.
    """
    pass

class QuizAttemptUpdate(BaseModel):
    """
    Fields for updating a quiz attempt (all optional).
    """
    quiz_id: Optional[int] = None
    student_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    score: Optional[float] = None
    status: Optional[str] = None
    feedback: Optional[str] = None

class QuizAttemptInDBBase(QuizAttemptBase):
    """
    Fields returned from the database for quiz attempt records.
    """
    attempt_id: int = Field(..., description="Primary key for the quiz attempt entry")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class QuizAttempt(QuizAttemptInDBBase):
    """
    API schema for reading quiz attempt records.
    """
    pass

class QuizAttemptInDB(QuizAttemptInDBBase):
    """
    Internal DB schema for quiz attempt records.
    """
    pass