"""
Quiz Files API Router (Production)
----------------------------------
Handles the upload, retrieval, and management of files attached to quizzes for the LMS.

- Only production-ready endpoints; no demo/sample logic.
- RBAC: Professors/Associate Teachers and authorized students only.
- All file type/size validation and access control is enforced by unified services.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List
from app.schemas.quiz_file import QuizFileCreate, QuizFileResponse
from app.services.quiz_file_service import QuizFileService
from app.core.auth import get_current_user
from app.core.security import validate_upload_file

router = APIRouter()

@router.post(
    "/",
    response_model=QuizFileResponse,
    summary="Upload a file for a quiz (staff only)",
    status_code=status.HTTP_201_CREATED,
)
async def upload_quiz_file(
    quiz_id: str,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """
    Upload a file related to a quiz.
    Only staff for the course/section can upload. Validates type/size using global validator.
    """
    validate_upload_file(file)
    return await QuizFileService.create_quiz_file(
        quiz_id=quiz_id,
        file=file,
        user=current_user
    )

@router.get(
    "/{file_id}",
    response_model=QuizFileResponse,
    summary="Get a quiz file (meta info and download link)"
)
async def get_quiz_file(
    file_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve quiz file metadata and a secure download URL if authorized.
    """
    return await QuizFileService.get_quiz_file_by_id(file_id=file_id, user=current_user)

@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a quiz file (staff only)",
)
async def delete_quiz_file(
    file_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a quiz file by ID. Allowed for uploader or assigned staff.
    """
    await QuizFileService.delete_quiz_file(file_id=file_id, user=current_user)
    return None

@router.get(
    "/quiz/{quiz_id}",
    response_model=List[QuizFileResponse],
    summary="List all files attached to a quiz"
)
async def list_quiz_files_for_quiz(
    quiz_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all files attached to a specific quiz for authorized users.
    """
    return await QuizFileService.list_quiz_files_by_quiz(quiz_id=quiz_id, user=current_user)