"""
QuizFileSubmission Schema (Production)
--------------------------------------
Pydantic schemas for QuizFileSubmission model, used for validation and serialization of quiz submissions that involve file uploads.

- No sample, demo, or test code.
- Follows global schema conventions for system-wide unification.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuizFileSubmissionBase(BaseModel):
    """
    Shared schema for quiz file submission create/update/read.
    """
    quiz_id: int = Field(..., description="ID of the quiz")
    student_id: int = Field(..., description="ID of the student submitting the file")
    file_path: str = Field(..., description="Path to the submitted file")
    filename: str = Field(..., description="Name of the uploaded file")
    submitted_at: Optional[datetime] = Field(None, description="Submission datetime")
    grade: Optional[float] = Field(None, description="Grade received for submission")
    feedback: Optional[str] = Field(None, description="Instructor's feedback")

class QuizFileSubmissionCreate(QuizFileSubmissionBase):
    """
    Fields required to create a new quiz file submission.
    """
    pass

class QuizFileSubmissionUpdate(BaseModel):
    """
    Fields for updating quiz file submission (all optional).
    """
    quiz_id: Optional[int] = None
    student_id: Optional[int] = None
    file_path: Optional[str] = None
    filename: Optional[str] = None
    submitted_at: Optional[datetime] = None
    grade: Optional[float] = None
    feedback: Optional[str] = None

class QuizFileSubmissionInDBBase(QuizFileSubmissionBase):
    """
    Fields provided from DB for quiz file submission records.
    """
    submission_id: int = Field(..., description="Primary key for quiz file submission")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class QuizFileSubmission(QuizFileSubmissionInDBBase):
    """
    Schema for API reading file submission records.
    """
    pass

class QuizFileSubmissionInDB(QuizFileSubmissionInDBBase):
    """
    Internal DB schema for quiz file submission records.
    """
    pass