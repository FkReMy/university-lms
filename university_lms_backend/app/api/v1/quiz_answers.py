"""
Quiz Answers API Router (Production)
------------------------------------
Handles CRUD endpoints for student answers to quiz questions.

- Only real production endpoints: create/submit, view, update, and staff review.
- RBAC enforced: students can operate on their own, staff for their quizzes.
- Unified with global schemas, services, and security.
- No samples, demos, or dev/test code.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.quiz_answer import (
    QuizAnswerCreate,
    QuizAnswerUpdate,
    QuizAnswerResponse,
)
from app.services.quiz_answer_service import QuizAnswerService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=QuizAnswerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit or update an answer to a quiz question (student)"
)
async def submit_quiz_answer(
    answer: QuizAnswerCreate,
    current_user=Depends(get_current_user),
):
    """
    Student submits or updates an answer to a quiz question.
    Only their own quizzes for which they are enrolled and active.
    """
    return await QuizAnswerService.submit_answer(answer=answer, user=current_user)

@router.get(
    "/mine/{attempt_id}",
    response_model=List[QuizAnswerResponse],
    summary="Get all answers for the student's quiz attempt (ownership enforced)"
)
async def get_my_quiz_answers(
    attempt_id: str,
    current_user=Depends(get_current_user),
):
    """
    Student gets all their answers for a quiz attempt.
    """
    return await QuizAnswerService.get_answers_for_attempt(attempt_id=attempt_id, user=current_user)

@router.get(
    "/attempt/{attempt_id}",
    response_model=List[QuizAnswerResponse],
    summary="List all answers for a quiz attempt (staff access)"
)
async def staff_list_quiz_answers(
    attempt_id: str,
    current_user=Depends(get_current_user),
):
    """
    Professor/Associate teacher lists all answers for a quiz attempt.
    """
    return await QuizAnswerService.staff_list_answers_for_attempt(attempt_id=attempt_id, user=current_user)

@router.patch(
    "/{answer_id}",
    response_model=QuizAnswerResponse,
    summary="Update an answer (student before grading, staff for review/correction)"
)
async def update_quiz_answer(
    answer_id: str,
    answer_update: QuizAnswerUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update a quiz answer before grading; staff can update for corrections/regrading.
    """
    return await QuizAnswerService.update_answer(answer_id=answer_id, answer_update=answer_update, user=current_user)

@router.get(
    "/{answer_id}",
    response_model=QuizAnswerResponse,
    summary="Get a quiz answer by ID (ownership or staff only)"
)
async def get_quiz_answer(
    answer_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get a single quiz answer.
    Staff: staff for the quiz/section. Student: own answers only.
    """
    return await QuizAnswerService.get_answer_by_id(answer_id=answer_id, user=current_user)

@router.delete(
    "/{answer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a quiz answer (student before grading, admin/staff for cleanup)"
)
async def delete_quiz_answer(
    answer_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a quiz answer entry.
    Student: before quiz is graded; staff: as per policy.
    """
    await QuizAnswerService.delete_answer(answer_id=answer_id, user=current_user)
    return None