"""
Assignment Submissions API Router (Production)
----------------------------------------------
Manages assignment submissions (file or digital) for students, and staff review/feedback.

Key Features:
- Students can submit, view, and update their assignment submissions (before deadline).
- Professors/Associate Teachers can list, view, grade, and give feedback on all submissions for their assignments.
- RBAC: All actions validated for user role and assignment permissions.
- Consistent with unified schema/service layer.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List, Optional
from app.schemas.assignment_submission import (
    AssignmentSubmissionCreate,
    AssignmentSubmissionUpdate,
    AssignmentSubmissionResponse,
    AssignmentSubmissionFeedbackRequest,
)
from app.services.assignment_submission_service import AssignmentSubmissionService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=AssignmentSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit or update student assignment submission"
)
async def submit_assignment(
    assignment_id: str,
    file: Optional[UploadFile] = File(None),
    submission_data: Optional[AssignmentSubmissionCreate] = None,
    current_user=Depends(get_current_user),
):
    """
    Submit or update a student's assignment (file upload, digital, or both).
    Role: Student.
    - Checks assignment deadline and student enrollment.
    - Only one final submission is kept for each student-assignment.
    """
    return await AssignmentSubmissionService.submit_assignment(
        assignment_id=assignment_id, file=file, submission_data=submission_data, user=current_user
    )

@router.get(
    "/mine/{assignment_id}",
    response_model=AssignmentSubmissionResponse,
    summary="Get the current student's own submission by assignment."
)
async def get_my_submission(
    assignment_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get the student's submission for a specific assignment.
    Role: Student, must be enrolled.
    """
    return await AssignmentSubmissionService.get_student_submission(
        assignment_id=assignment_id, user=current_user
    )

@router.get(
    "/assignment/{assignment_id}",
    response_model=List[AssignmentSubmissionResponse],
    summary="List all submissions for an assignment (staff only)."
)
async def list_assignment_submissions(
    assignment_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all submissions for the given assignment.
    Role: Professor/Associate Teacher for this assignment.
    """
    return await AssignmentSubmissionService.list_submissions_for_assignment(
        assignment_id=assignment_id, user=current_user
    )

@router.get(
    "/{submission_id}",
    response_model=AssignmentSubmissionResponse,
    summary="Get a student's submission by submission ID (staff, owner)."
)
async def get_submission_by_id(
    submission_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get a submission by ID (must be enrollment staff or owner).
    """
    return await AssignmentSubmissionService.get_submission_by_id(
        submission_id=submission_id, user=current_user
    )

@router.post(
    "/{submission_id}/feedback",
    response_model=AssignmentSubmissionResponse,
    summary="Add or update staff feedback on an assignment submission."
)
async def add_feedback(
    submission_id: str,
    feedback: AssignmentSubmissionFeedbackRequest,
    current_user=Depends(get_current_user),
):
    """
    Staff (professor/associate teacher) may add feedback (grade, comments) to a submission.
    """
    return await AssignmentSubmissionService.add_feedback(
        submission_id=submission_id, feedback=feedback, user=current_user
    )

@router.delete(
    "/{submission_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a submission (by student or admin only, before grading)."
)
async def delete_submission(
    submission_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete (withdraw) a submission.
    Allowed: Student (before grading), admin.
    """
    await AssignmentSubmissionService.delete_submission(submission_id=submission_id, user=current_user)
    return None