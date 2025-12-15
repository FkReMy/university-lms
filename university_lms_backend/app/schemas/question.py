"""
Question Schema (Production)
----------------------------
Pydantic schemas for the Question model, supporting creation, update, and read APIs for quiz or assignment questions.

- No sample, demo, or test code.
- Follows unified global schema conventions for system-wide consistency.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuestionBase(BaseModel):
    """
    Shared base schema for question create/update/read.
    """
    quiz_id: int = Field(..., description="Associated quiz (or assessment) ID")
    text: str = Field(..., description="The question text/content")
    type: str = Field(..., description="Question type: 'multiple-choice', 'short-answer', etc.")
    points: Optional[float] = Field(1.0, description="Points awarded for a correct answer")
    explanation: Optional[str] = Field(None, description="Solution or explanation for the answer")

class QuestionCreate(QuestionBase):
    """
    Schema for creating a new Question.
    """
    pass

class QuestionUpdate(BaseModel):
    """
    Schema for updating a question (all fields optional).
    """
    quiz_id: Optional[int] = None
    text: Optional[str] = None
    type: Optional[str] = None
    points: Optional[float] = None
    explanation: Optional[str] = None

class QuestionInDBBase(QuestionBase):
    """
    Fields typically returned from the database.
    """
    question_id: int = Field(..., description="Primary key for the question")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Question(QuestionInDBBase):
    """
    Schema for API serialization of question.
    """
    pass

class QuestionInDB(QuestionInDBBase):
    """
    Internal DB schema for a question.
    """
    pass