"""
QuestionOption Schema (Production)
----------------------------------
Pydantic schemas for the QuestionOption model, handling validation and serialization for question options (e.g., for MCQs).

- No sample, demo, or test code.
- Follows system-wide schema conventions for LMS unification.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuestionOptionBase(BaseModel):
    """
    Shared base fields for question option create/update/read.
    """
    question_id: int = Field(..., description="ID of the related question")
    text: str = Field(..., description="Option text content")
    is_correct: Optional[bool] = Field(False, description="Indicates if this option is the correct answer")
    explanation: Optional[str] = Field(None, description="Explanation for why this option is correct/incorrect")

class QuestionOptionCreate(QuestionOptionBase):
    """
    Fields required to create a new question option.
    """
    pass

class QuestionOptionUpdate(BaseModel):
    """
    Fields allowed for update on a question option (all optional).
    """
    question_id: Optional[int] = None
    text: Optional[str] = None
    is_correct: Optional[bool] = None
    explanation: Optional[str] = None

class QuestionOptionInDBBase(QuestionOptionBase):
    """
    Fields returned from database for question options.
    """
    option_id: int = Field(..., description="Primary key for question option")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class QuestionOption(QuestionOptionInDBBase):
    """
    Schema for API reading question option records.
    """
    pass

class QuestionOptionInDB(QuestionOptionInDBBase):
    """
    Internal DB schema for question option records.
    """
    pass