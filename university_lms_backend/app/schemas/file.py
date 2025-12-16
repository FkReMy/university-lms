"""
File Schema (Production)
------------------------
Pydantic schemas for file upload and management.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FileUploadResponse(BaseModel):
    """Response schema for file upload"""
    file_id: int = Field(..., description="Uploaded file ID")
    filename: str = Field(..., description="Original filename")
    file_path: str = Field(..., description="File storage path")
    file_size: Optional[int] = Field(None, description="File size in bytes")
    mime_type: Optional[str] = Field(None, description="MIME type")
    uploaded_at: Optional[datetime] = None


class FileInfoResponse(BaseModel):
    """Response schema for file information"""
    file_id: int
    filename: str
    file_path: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    uploaded_by: Optional[int] = Field(None, description="User ID who uploaded")
    uploaded_at: Optional[datetime] = None
