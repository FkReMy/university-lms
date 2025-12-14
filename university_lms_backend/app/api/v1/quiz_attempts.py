"""
Quiz Attempts API Router (Production)
-------------------------------------
Handles quiz attempt session management and staff/student access.

- Students can start, view, and submit attempts on quizzes.
- Professors/Associate Teachers can list, view, and reset attempts for students.
- Strict RBAC, unified services and schemas.
- No sample/demo, only production logic.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.quiz_attempt import (
    QuizAttemptCreate,
    QuizAttemptResponse,
    QuizAttemptUpdate,
)
from app.services.quiz_attempt_service import QuizAttemptService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=QuizAttemptResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start a quiz attempt (student only)"
)
async def start_quiz_attempt(
    attempt_data: QuizAttemptCreate,
    current_user=Depends(get_current_user),
):
    """
    Student starts a new attempt for a quiz.
    """
    return await QuizAttemptService.start_attempt(
        attempt_data=attempt_data, user=current_user
    )

@router.get(
    "/mine/{quiz_id}",
    response_model=List[QuizAttemptResponse],
    summary="Get all attempts for a quiz (by current student)"
)
async def get_my_quiz_attempts(
    quiz_id: str,
    current_user=Depends(get_current_user),
):
    """
    Student retrieves all own attempts for this quiz.
    """
    return await QuizAttemptService.get_student_attempts(quiz_id=quiz_id, user=current_user)

@router.get(
    "/quiz/{quiz_id}",
    response_model=List[QuizAttemptResponse],
    summary="List all quiz attempts (staff only for review/grading)"
)
async def list_attempts_for_quiz(
    quiz_id: str,
    current_user=Depends(get_current_user),
):
    """
    Professors and associate teachers retrieve all attempts for this quiz for staff review.
    """
    return await QuizAttemptService.list_attempts_for_quiz(quiz_id=quiz_id, user=current_user)

@router.get(
    "/{attempt_id}",
    response_model=QuizAttemptResponse,
    summary="Get a quiz attempt by ID (own or staff only)"
)
async def get_quiz_attempt(
    attempt_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve details about a specific quiz attempt.
    Role: Student (own attempt) or assigned staff.
    """
    return await QuizAttemptService.get_attempt_by_id(attempt_id=attempt_id, user=current_user)

@router.patch(
    "/{attempt_id}",
    response_model=QuizAttemptResponse,
    summary="Update a quiz attempt (submit, mark finished, etc)"
)
async def update_quiz_attempt(
    attempt_id: str,
    attempt_update: QuizAttemptUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update attempt status (submit, mark complete, grant extension, etc).
    """
    return await QuizAttemptService.update_attempt(
        attempt_id=attempt_id, attempt_update=attempt_update, user=current_user
    )

@router.delete(
    "/{attempt_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a quiz attempt (admin/staff only)"
)
async def delete_quiz_attempt(
    attempt_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete an attempt (admin/staff only, or for cleanup).
    """
    await QuizAttemptService.delete_attempt(attempt_id=attempt_id, user=current_user)
    return None