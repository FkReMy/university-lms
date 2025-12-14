"""
Assignment Files API Router (Production)
----------------------------------------
Handles endpoints related to uploading, retrieving, and managing assignment-related files
within the University LMS backend.

- Only allows access for authorized users (role and ownership checks enforced in service layer).
- No sample, demo or unnecessary logic.
- Uses unified schemas/services for validation and storage.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List
from app.schemas.assignment_file import AssignmentFileCreate, AssignmentFileResponse
from app.services.assignment_file_service import AssignmentFileService
from app.core.auth import get_current_user
from app.core.security import validate_upload_file

router = APIRouter()

@router.post(
    "/",
    response_model=AssignmentFileResponse,
    summary="Upload a file for an assignment",
    status_code=status.HTTP_201_CREATED,
)
async def upload_assignment_file(
    assignment_id: str,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """
    Upload a file related to an assignment.
    - Only professors or associate teachers for the course/section can upload.
    - Validates file type and size using unified components.
    """
    validate_upload_file(file)
    return await AssignmentFileService.create_assignment_file(
        assignment_id=assignment_id, file=file, user=current_user
    )

@router.get(
    "/{file_id}",
    response_model=AssignmentFileResponse,
    summary="Get single assignment file (meta info and download URL)",
)
async def get_assignment_file(
    file_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve an assignment file's metadata and direct download URL if authorized.
    Only authorized users (professor, associate teacher, student enrolled) can access.
    """
    return await AssignmentFileService.get_assignment_file_by_id(
        file_id=file_id, user=current_user
    )

@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an assignment file (soft delete or remove for the assignment)",
)
async def delete_assignment_file(
    file_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete an assignment file by ID.
    Only allowed for uploader or course staff.
    """
    await AssignmentFileService.delete_assignment_file(file_id=file_id, user=current_user)
    return None

@router.get(
    "/assignment/{assignment_id}",
    response_model=List[AssignmentFileResponse],
    summary="List all files attached to an assignment",
)
async def list_assignment_files_for_assignment(
    assignment_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all files attached to a specific assignment that the user is authorized to view.
    """
    return await AssignmentFileService.list_assignment_files_by_assignment(
        assignment_id=assignment_id, user=current_user
    )