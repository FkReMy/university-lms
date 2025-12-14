"""
Student Section Assignments API Router (Production)
---------------------------------------------------
Manages the mapping/assignment of students to individual section groups for registration
and enrollment purposes in the University LMS.

- All endpoints strictly use only validated, unified global schemas and services.
- No sample or demo endpoints.
- Staff/admin control all assignment modifications; students can only access their assignments.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.student_section_assignment import (
    StudentSectionAssignmentCreate,
    StudentSectionAssignmentUpdate,
    StudentSectionAssignmentResponse,
)
from app.services.student_section_assignment_service import StudentSectionAssignmentService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=StudentSectionAssignmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Assign a student to a section group (staff/admin only)",
)
async def create_student_section_assignment(
    assignment: StudentSectionAssignmentCreate,
    current_user=Depends(get_current_user),
):
    """
    Assign a student to a particular section group.
    Only allowed for staff/admin.
    """
    return await StudentSectionAssignmentService.create_assignment(assignment=assignment, user=current_user)

@router.get(
    "/{assignment_id}",
    response_model=StudentSectionAssignmentResponse,
    summary="Get a student-section assignment by ID"
)
async def get_student_section_assignment(
    assignment_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve the mapping of a student to a section group by assignment ID.
    Only the student assigned, or relevant staff/admin.
    """
    return await StudentSectionAssignmentService.get_assignment_by_id(assignment_id=assignment_id, user=current_user)

@router.patch(
    "/{assignment_id}",
    response_model=StudentSectionAssignmentResponse,
    summary="Update a student-section assignment (staff/admin only)",
)
async def update_student_section_assignment(
    assignment_id: str,
    assignment_update: StudentSectionAssignmentUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update the section assignment for a student.
    Only staff or admin for the section can do this.
    """
    return await StudentSectionAssignmentService.update_assignment(
        assignment_id=assignment_id,
        assignment_update=assignment_update,
        user=current_user,
    )

@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a student-section assignment (staff/admin only)"
)
async def delete_student_section_assignment(
    assignment_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a student assignment from a section (remove mapping).
    Only allowed by staff/admin.
    """
    await StudentSectionAssignmentService.delete_assignment(assignment_id=assignment_id, user=current_user)
    return None

@router.get(
    "/student/{student_id}",
    response_model=List[StudentSectionAssignmentResponse],
    summary="List all section assignments for a student"
)
async def list_assignments_for_student(
    student_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all section assignments for a student.
    Access limited to the student or admin/staff for compliance.
    """
    return await StudentSectionAssignmentService.list_assignments_for_student(student_id=student_id, user=current_user)

@router.get(
    "/section-group/{section_group_id}",
    response_model=List[StudentSectionAssignmentResponse],
    summary="List all students assigned to a section group"
)
async def list_students_for_section_group(
    section_group_id: str,
    current_user=Depends(get_current_user),
):
    """
    Lists all student assignments within a section group.
    Only staff/admin may view.
    """
    return await StudentSectionAssignmentService.list_students_for_section_group(section_group_id=section_group_id, user=current_user)