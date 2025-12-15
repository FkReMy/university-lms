"""
QuizFile Schema (Production)
----------------------------
Pydantic schemas for the QuizFile model, enabling validation and serialization of files attached to quizzes.

- No sample, demo, or test code.
- Follows global schema conventions for unified codebase.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QuizFileBase(BaseModel):
    """
    Shared schema for quiz file creation, update, and read.
    """
    quiz_id: int = Field(..., description="ID of the associated quiz")
    file_path: str = Field(..., description="File storage path")
    uploaded_by_id: int = Field(..., description="User ID of the uploader")
    filename: str = Field(..., description="Original name of the uploaded file")
    description: Optional[str] = Field(None, description="File description or notes")

class QuizFileCreate(QuizFileBase):
    """
    Fields required to create a quiz file record.
    """
    pass

class QuizFileUpdate(BaseModel):
    """
    Fields for updating quiz file records (all optional).
    """
    quiz_id: Optional[int] = None
    file_path: Optional[str] = None
    uploaded_by_id: Optional[int] = None
    filename: Optional[str] = None
    description: Optional[str] = None

class QuizFileInDBBase(QuizFileBase):
    """
    Fields for DB result/response schemas.
    """
    quiz_file_id: int = Field(..., description="Primary key of the quiz file record")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class QuizFile(QuizFileInDBBase):
    """
    API schema for reading quiz file records.
    """
    pass

class QuizFileInDB(QuizFileInDBBase):
    """
    Internal DB schema for quiz file records.
    """
    pass