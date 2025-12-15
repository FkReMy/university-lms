"""
QuizAnswer Schema (Production)
------------------------------
Pydantic schemas for QuizAnswer model, handling user submissions to quizzes including validation and serialization.

- No sample, demo, or test code.
- Follows unified global schema conventions for maintainability.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuizAnswerBase(BaseModel):
    """
    Shared base schema for quiz answer create/update/read.
    """
    quiz_id: int = Field(..., description="Associated quiz ID")
    question_id: int = Field(..., description="Associated question ID")
    student_id: int = Field(..., description="User ID of the student answering")
    selected_option_id: Optional[int] = Field(None, description="Selected option's ID for MCQ-type questions")
    answer_text: Optional[str] = Field(None, description="Submitted answer text, if applicable")
    is_correct: Optional[bool] = Field(None, description="Indicates if answer was correct according to key")
    grade: Optional[float] = Field(None, description="Score awarded to this answer")
    feedback: Optional[str] = Field(None, description="Grading feedback for the answer")

class QuizAnswerCreate(QuizAnswerBase):
    """
    Fields required to create a new quiz answer record.
    """
    pass

class QuizAnswerUpdate(BaseModel):
    """
    Fields allowed for updating a quiz answer (all optional).
    """
    quiz_id: Optional[int] = None
    question_id: Optional[int] = None
    student_id: Optional[int] = None
    selected_option_id: Optional[int] = None
    answer_text: Optional[str] = None
    is_correct: Optional[bool] = None
    grade: Optional[float] = None
    feedback: Optional[str] = None

class QuizAnswerInDBBase(QuizAnswerBase):
    """
    Fields provided by DB for quiz answer records.
    """
    quiz_answer_id: int = Field(..., description="Primary key for quiz answer record")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class QuizAnswer(QuizAnswerInDBBase):
    """
    API schema for reading quiz answer objects.
    """
    pass

class QuizAnswerInDB(QuizAnswerInDBBase):
    """
    Internal DB schema for quiz answer records.
    """
    pass