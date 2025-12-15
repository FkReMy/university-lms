"""
Student Schema (Production)
---------------------------
Pydantic schemas for the Student model, governing validation and serialization of student records within the LMS.

- No sample, demo, or test code.
- Follows global system schema conventions and unification best practices.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    """
    Shared base schema for student creation, update, and read operations.
    """
    user_id: int = Field(..., description="Link to the main user account")
    department_id: Optional[int] = Field(None, description="Reference to the department of the student")
    specialization_id: Optional[int] = Field(None, description="Reference to the student's specialization, if any")
    status: Optional[str] = Field("active", description="Enrollment status (active/inactive/graduated/etc.)")

class StudentCreate(StudentBase):
    """
    Schema used for creating a student record.
    """
    pass

class StudentUpdate(BaseModel):
    """
    Fields that are allowed for update on a student (all optional for PATCH semantics).
    """
    user_id: Optional[int] = None
    department_id: Optional[int] = None
    specialization_id: Optional[int] = None
    status: Optional[str] = None

class StudentInDBBase(StudentBase):
    """
    Database/internal use fields for student records.
    """
    student_id: int = Field(..., description="Primary key for the student record")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Student(StudentInDBBase):
    """
    API schema for reading student records.
    """
    pass

class StudentInDB(StudentInDBBase):
    """
    Internal DB schema for student records.
    """
    pass