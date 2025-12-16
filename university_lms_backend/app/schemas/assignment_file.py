"""
AssignmentFile Schema (Production)
----------------------------------
Pydantic schemas for AssignmentFile model, used for managing request/response validation and serialization.

- No sample, demo, or test code.
- Follows global schema conventions and Pydantic style for LMS unification.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AssignmentFileBase(BaseModel):
    """
    Shared base fields for AssignmentFile create/update/read.
    """
    assignment_id: int = Field(..., description="ID of the related assignment")
    file_path: str = Field(..., description="Filesystem or storage path to the file")
    uploaded_by_id: int = Field(..., description="User ID of the uploader")
    filename: str = Field(..., description="Original name of the file")
    description: Optional[str] = Field(None, description="Optional file description")

class AssignmentFileCreate(AssignmentFileBase):
    """
    Fields for assignment file creation.
    """
    pass

class AssignmentFileUpdate(BaseModel):
    """
    Fields for updating an assignment file (all optional).
    """
    assignment_id: Optional[int] = None
    file_path: Optional[str] = None
    uploaded_by_id: Optional[int] = None
    filename: Optional[str] = None
    description: Optional[str] = None

class AssignmentFileInDBBase(AssignmentFileBase):
    """
    Common fields returned by DB for internal or API responses.
    """
    assignment_file_id: int = Field(..., description="Primary key for the assignment file")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class AssignmentFile(AssignmentFileInDBBase):
    """
    Schema for reading assignment files.
    """
    pass

class AssignmentFileResponse(AssignmentFileInDBBase):
    """
    Response schema returned by API endpoints.
    """
    pass

class AssignmentFileInDB(AssignmentFileInDBBase):
    """
    Schema for returning assignment files internally from DB operations.
    """
    pass