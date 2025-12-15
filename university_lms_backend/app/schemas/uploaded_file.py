"""
UploadedFile Schema (Production)
--------------------------------
Pydantic schemas for the UploadedFile model, used for handling user file uploads across the LMS (e.g., assignments, resources, profile images).

- No sample, demo, or test code.
- Follows system-wide schema conventions for unified architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UploadedFileBase(BaseModel):
    """
    Shared base schema for uploaded file creation, update, and read.
    """
    user_id: int = Field(..., description="ID of the user uploading the file")
    file_path: str = Field(..., description="Path where the file is stored")
    filename: str = Field(..., description="Original file name")
    description: Optional[str] = Field(None, description="Description or purpose/context for the file")
    file_size: Optional[int] = Field(None, description="File size in bytes")
    file_type: Optional[str] = Field(None, description="MIME type or extension of the file")

class UploadedFileCreate(UploadedFileBase):
    """
    Fields required to create a new uploaded file record.
    """
    pass

class UploadedFileUpdate(BaseModel):
    """
    Fields allowed for updating an uploaded file (all optional).
    """
    user_id: Optional[int] = None
    file_path: Optional[str] = None
    filename: Optional[str] = None
    description: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None

class UploadedFileInDBBase(UploadedFileBase):
    """
    Common fields provided by the DB for uploaded files.
    """
    uploaded_file_id: int = Field(..., description="Primary key for the uploaded file record")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class UploadedFile(UploadedFileInDBBase):
    """
    Schema for API reading of uploaded file records.
    """
    pass

class UploadedFileInDB(UploadedFileInDBBase):
    """
    Internal DB schema for uploaded file records.
    """
    pass