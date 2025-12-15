"""
StudentSectionAssignment Schema (Production)
--------------------------------------------
Pydantic schemas for StudentSectionAssignment model, representing the assignment of a student to a section group.

- No sample, demo, or test code.
- Follows global schema conventions for consistent, unified architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StudentSectionAssignmentBase(BaseModel):
    """
    Shared base schema for section group assignment creation, update, and read.
    """
    student_id: int = Field(..., description="ID of the student being assigned")
    section_group_id: int = Field(..., description="ID of the section group to which the student is assigned")
    status: Optional[str] = Field("active", description="Assignment status (active/inactive)")

class StudentSectionAssignmentCreate(StudentSectionAssignmentBase):
    """
    Schema for creating a new student section assignment.
    """
    pass

class StudentSectionAssignmentUpdate(BaseModel):
    """
    Fields allowed for updating a student section assignment (all optional).
    """
    student_id: Optional[int] = None
    section_group_id: Optional[int] = None
    status: Optional[str] = None

class StudentSectionAssignmentInDBBase(StudentSectionAssignmentBase):
    """
    DB-response and internal-use fields for section assignments.
    """
    assignment_id: int = Field(..., description="Primary key for the student-section group assignment")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class StudentSectionAssignment(StudentSectionAssignmentInDBBase):
    """
    API schema for reading student section assignment records.
    """
    pass

class StudentSectionAssignmentInDB(StudentSectionAssignmentInDBBase):
    """
    Internal DB schema for student section assignment records.
    """
    pass