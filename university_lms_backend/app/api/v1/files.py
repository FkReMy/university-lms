"""
Files API Router (Production)
-----------------------------
Handles uploading, downloading, and management of files within University LMS.

- Unified storage and retrieval for all file types.
- File access and security validated by ownership, assignment, and user role.
- Uses common services and schemas for upload validation and metadata.
- No samples, demos, or legacy logic.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List
from app.schemas.file import (
    FileUploadResponse,
    FileInfoResponse,
)
from app.services.file_service import FileService
from app.core.auth import get_current_user
from app.core.security import validate_upload_file

router = APIRouter()

@router.post(
    "/upload",
    response_model=FileUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a file (general purpose, subject to access/size restrictions)"
)
async def upload_file(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """
    Upload a file for assignments, quizzes, or materials.
    - Enforces unified type/size restrictions.
    - File is linked to the user and a usage context.
    """
    validate_upload_file(file)
    return await FileService.upload_file(file=file, user=current_user)

@router.get(
    "/{file_id}",
    response_model=FileInfoResponse,
    summary="Get file info and download link by file ID"
)
async def get_file(
    file_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get file info and a secure download URL, if authorized.
    """
    return await FileService.get_file_by_id(file_id=file_id, user=current_user)

@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a file by ID (owner/admin only)"
)
async def delete_file(
    file_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a file. Allowed for uploader or admin.
    """
    await FileService.delete_file(file_id=file_id, user=current_user)
    return None

@router.get(
    "/user/files",
    response_model=List[FileInfoResponse],
    summary="List all files uploaded by the authenticated user"
)
async def list_user_files(
    current_user=Depends(get_current_user),
):
    """
    List all files uploaded by the current user.
    """
    return await FileService.list_files_by_user(user=current_user)