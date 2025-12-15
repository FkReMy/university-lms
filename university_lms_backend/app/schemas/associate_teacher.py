"""
AssociateTeacher Schema (Production)
------------------------------------
Pydantic schemas for AssociateTeacher model, enforcing type and API validation for associate teacher assignments.

- No sample, demo, or test code.
- Global schema conventions followed for system unity.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AssociateTeacherBase(BaseModel):
    """
    Shared base schema for create/read/update operations.
    """
    course_offering_id: int = Field(..., description="ID of the associated course offering")
    teacher_id: int = Field(..., description="User ID of the associated teacher")
    role: Optional[str] = Field(None, description="Role or label, e.g., 'TA' or 'co-instructor'")

class AssociateTeacherCreate(AssociateTeacherBase):
    """
    Schema for creation of associate teacher assignment.
    """
    pass

class AssociateTeacherUpdate(BaseModel):
    """
    Fields allowed for updating an associate teacher assignment.
    """
    course_offering_id: Optional[int] = None
    teacher_id: Optional[int] = None
    role: Optional[str] = None

class AssociateTeacherInDBBase(AssociateTeacherBase):
    """
    Shared DB/response fields for associate teacher.
    """
    associate_teacher_id: int = Field(..., description="Primary key for the associate teacher assignment")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class AssociateTeacher(AssociateTeacherInDBBase):
    """
    API schema for reading an associate teacher assignment.
    """
    pass

class AssociateTeacherInDB(AssociateTeacherInDBBase):
    """
    Internal DB schema for associate teacher assignment.
    """
    pass