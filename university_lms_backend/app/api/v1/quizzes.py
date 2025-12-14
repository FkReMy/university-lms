"""
Quizzes API Router (Production)
-------------------------------
Manages quizzes: creation, retrieval, update, publish, and deletion.

- Professors/Associate Teachers can create, update, publish, and delete quizzes.
- Students can list and get only published/assigned quizzes for their courses/sections.
- All routes use unified schemas/services.
- No sample/demo/dev logic.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.quiz import (
    QuizCreate,
    QuizUpdate,
    QuizResponse,
)
from app.services.quiz_service import QuizService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=QuizResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new quiz (professor/associate teacher only)"
)
async def create_quiz(
    quiz: QuizCreate,
    current_user=Depends(get_current_user),
):
    """
    Create a quiz for one or more section groups.
    Staff only (professor/associate teacher).
    """
    return await QuizService.create_quiz(quiz=quiz, user=current_user)

@router.get(
    "/{quiz_id}",
    response_model=QuizResponse,
    summary="Get quiz details by ID"
)
async def get_quiz(
    quiz_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get full details for a quiz.
    Staff: assigned section(s). Students: enrolled section, only if published.
    """
    return await QuizService.get_quiz_by_id(quiz_id=quiz_id, user=current_user)

@router.patch(
    "/{quiz_id}",
    response_model=QuizResponse,
    summary="Update a quiz (staff only, before publishing or as allowed)"
)
async def update_quiz(
    quiz_id: str,
    quiz_update: QuizUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update quiz properties (title, questions, publish/unpublish, deadlines, etc).
    Only allowed for the staff who created/are assigned to the quiz.
    """
    return await QuizService.update_quiz(quiz_id=quiz_id, quiz_update=quiz_update, user=current_user)

@router.delete(
    "/{quiz_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a quiz (staff only)"
)
async def delete_quiz(
    quiz_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a quiz (staff only).
    """
    await QuizService.delete_quiz(quiz_id=quiz_id, user=current_user)
    return None

@router.get(
    "/section-group/{section_group_id}",
    response_model=List[QuizResponse],
    summary="List all quizzes for a section group"
)
async def list_quizzes_for_section_group(
    section_group_id: str,
    current_user=Depends(get_current_user),
):
    """
    Return a list of quizzes for a section group to which the user has access.
    """
    return await QuizService.list_quizzes_by_section_group(section_group_id=section_group_id, user=current_user)