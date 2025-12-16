"""
Grade Schema (Production)
-------------------------
Pydantic schemas for the Grade model, used for validating and serializing student grades for assignments, quizzes, and overall courses.

- No sample, demo, or test code.
- Follows global schema conventions for unified system architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class GradeBase(BaseModel):
    """
    Shared base schema for grade creation, update, and read.
    """
    student_id: int = Field(..., description="ID of the student who received the grade")
    course_offering_id: int = Field(..., description="ID of the related course offering")
    assignment_id: Optional[int] = Field(None, description="ID of the related assignment, if applicable")
    quiz_id: Optional[int] = Field(None, description="ID of the related quiz, if applicable")
    value: float = Field(..., description="Grade value (e.g., points or percent)")
    weight: Optional[float] = Field(None, description="Weight of this grade in the final score")
    remarks: Optional[str] = Field(None, description="Instructor remarks or notes")

class GradeCreate(GradeBase):
    """
    Schema for creating a grade entry.
    """
    pass

class GradeUpdate(BaseModel):
    """
    Fields for updating a grade record (all optional).
    """
    student_id: Optional[int] = None
    course_offering_id: Optional[int] = None
    assignment_id: Optional[int] = None
    quiz_id: Optional[int] = None
    value: Optional[float] = None
    weight: Optional[float] = None
    remarks: Optional[str] = None

class GradeInDBBase(GradeBase):
    """
    Common fields provided by the DB for grade objects.
    """
    grade_id: int = Field(..., description="Primary key for the grade")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Grade(GradeInDBBase):
    """
    Schema for API reading grade records.
    """
    pass

class GradeResponse(GradeInDBBase):
    """
    Response schema returned by API endpoints.
    """
    pass

class GradeInDB(GradeInDBBase):
    """
    Internal DB schema for grade records.
    """
    pass