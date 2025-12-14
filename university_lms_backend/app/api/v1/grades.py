"""
Grades API Router (Production)
------------------------------
Handles grade management for assignments, quizzes, and final results across the University LMS.

Key Features:
- Professors/Associate Teachers can enter, update, and view all grades in their sections.
- Students can view only their own grades.
- Unified services for all grade sources (assignments, quizzes, etc).
- No demo/sample code, only real production logic and validation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.grade import (
    GradeCreate,
    GradeUpdate,
    GradeResponse,
)
from app.services.grade_service import GradeService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=GradeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enter grade for a student (staff only)"
)
async def enter_grade(
    grade: GradeCreate,
    current_user=Depends(get_current_user),
):
    """
    Enter a new grade for a given enrollment and assignment/quiz.
    Only allowed for professors/associate teachers.
    """
    return await GradeService.enter_grade(grade=grade, user=current_user)

@router.get(
    "/{grade_id}",
    response_model=GradeResponse,
    summary="Retrieve a grade by ID"
)
async def get_grade(
    grade_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve details for a specific grade.
    Staff: may access grades for their sections. Student: may access own grades only.
    """
    return await GradeService.get_grade_by_id(grade_id=grade_id, user=current_user)

@router.get(
    "/student/{student_id}",
    response_model=List[GradeResponse],
    summary="List all grades for a student (student or staff only)"
)
async def list_grades_for_student(
    student_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all grades for a specific student.
    Staff: only if assigned to student's section(s).
    Student: only self.
    """
    return await GradeService.list_grades_for_student(student_id=student_id, user=current_user)

@router.get(
    "/enrollment/{enrollment_id}",
    response_model=List[GradeResponse],
    summary="List all grades for an enrollment record"
)
async def list_grades_for_enrollment(
    enrollment_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all grades for a student in the context of an enrollment (section/course).
    """
    return await GradeService.list_grades_for_enrollment(enrollment_id=enrollment_id, user=current_user)

@router.patch(
    "/{grade_id}",
    response_model=GradeResponse,
    summary="Update an existing grade (staff only)"
)
async def update_grade(
    grade_id: str,
    grade_update: GradeUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update grade details (score, feedback, etc.).
    Only by professors/associate teachers who entered or supervise the grade.
    """
    return await GradeService.update_grade(grade_id=grade_id, grade_update=grade_update, user=current_user)

@router.delete(
    "/{grade_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a grade (admin or staff only)"
)
async def delete_grade(
    grade_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a grade record, if policy allows (admin/staff only).
    """
    await GradeService.delete_grade(grade_id=grade_id, user=current_user)
    return None