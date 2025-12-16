"""
Enrollment Schema (Production)
------------------------------
Pydantic schemas for Enrollment model, used for validation and serialization of student enrollments in course offerings.

- No sample, demo, or test code.
- Adheres to global schema conventions for system-wide consistency.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EnrollmentBase(BaseModel):
    """
    Shared fields for Enrollment create/update/read operations.
    """
    student_id: int = Field(..., description="ID of the enrolled student")
    course_offering_id: int = Field(..., description="ID of the course offering the student is enrolled in")
    status: Optional[str] = Field("active", description="Enrollment status (e.g., active, dropped, completed)")

class EnrollmentCreate(EnrollmentBase):
    """
    Schema for creating a new enrollment record.
    """
    pass

class EnrollmentUpdate(BaseModel):
    """
    Fields for updating an enrollment (all optional, for PATCH semantics).
    """
    student_id: Optional[int] = None
    course_offering_id: Optional[int] = None
    status: Optional[str] = None

class EnrollmentInDBBase(EnrollmentBase):
    """
    Shared fields returned by the DB for enrollment records.
    """
    enrollment_id: int = Field(..., description="Primary key for the enrollment entry")
    grade: Optional[float] = Field(None, description="Final grade for the enrollment, if applicable")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Enrollment(EnrollmentInDBBase):
    """
    Schema for API reading of enrollment records.
    """
    pass

class EnrollmentResponse(EnrollmentInDBBase):
    """
    Response schema returned by API endpoints.
    """
    pass

class EnrollmentInDB(EnrollmentInDBBase):
    """
    Schema for returning enrollment records from DB operations.
    """
    pass