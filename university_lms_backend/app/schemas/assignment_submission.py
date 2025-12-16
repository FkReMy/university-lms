"""
AssignmentSubmission Schema (Production)
----------------------------------------
Pydantic schemas for AssignmentSubmission model, used for validating requests and serializing responses concerning student assignment submissions.

- No sample, demo, or test code.
- Follows global schema conventions and Pydantic practices system-wide.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AssignmentSubmissionBase(BaseModel):
    """
    Shared base fields for assignment submission create/update/read.
    """
    assignment_id: int = Field(..., description="ID of the corresponding assignment")
    student_id: int = Field(..., description="ID of the submitting student")
    file_path: str = Field(..., description="Path to the submitted assignment file")
    filename: str = Field(..., description="Original filename uploaded")
    submitted_at: Optional[datetime] = Field(None, description="Timestamp of submission")
    grade: Optional[float] = Field(None, description="Grade for the submission")
    feedback: Optional[str] = Field(None, description="Feedback/comments from the instructor")

class AssignmentSubmissionCreate(AssignmentSubmissionBase):
    """
    Fields required to create a new assignment submission.
    """
    pass

class AssignmentSubmissionUpdate(BaseModel):
    """
    Fields allowed to update for assignment submissions (all optional).
    """
    assignment_id: Optional[int] = None
    student_id: Optional[int] = None
    file_path: Optional[str] = None
    filename: Optional[str] = None
    submitted_at: Optional[datetime] = None
    grade: Optional[float] = None
    feedback: Optional[str] = None

class AssignmentSubmissionInDBBase(AssignmentSubmissionBase):
    """
    Base fields returned from the database (internal/response).
    """
    submission_id: int = Field(..., description="Primary key for the assignment submission")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class AssignmentSubmission(AssignmentSubmissionInDBBase):
    """
    Schema for API reading assignment submissions.
    """
    pass

class AssignmentSubmissionResponse(AssignmentSubmissionInDBBase):
    """
    Response schema returned by API endpoints.
    """
    pass

class AssignmentSubmissionFeedbackRequest(BaseModel):
    """
    Request schema for providing feedback on assignment submissions.
    """
    grade: Optional[float] = Field(None, description="Grade for the submission")
    feedback: Optional[str] = Field(None, description="Feedback/comments from the instructor")

class AssignmentSubmissionInDB(AssignmentSubmissionInDBBase):
    """
    Schema for internal DB response.
    """
    pass