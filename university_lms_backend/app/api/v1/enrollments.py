"""
Enrollments API Router (Production)
-----------------------------------
Manages student enrollments in courses and section groups for University LMS.

- Handles registration, de-registration, admin adds, and roster listing.
- Uses only production schemas and unified service logic.
- All access validated by role, section/course assignment, and policy.
- No samples or demos, only real logic.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentUpdate,
    EnrollmentResponse,
)
from app.services.enrollment_service import EnrollmentService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Enroll a student in a section group (student self or admin)"
)
async def enroll_in_section(
    enrollment: EnrollmentCreate,
    current_user=Depends(get_current_user),
):
    """
    Enroll a student in a section group.
    Allowed: Self-enrollment by student (if open), or admin/staff-initiated.
    """
    return await EnrollmentService.enroll_in_section(enrollment=enrollment, user=current_user)

@router.get(
    "/{enrollment_id}",
    response_model=EnrollmentResponse,
    summary="Get enrollment details by enrollment ID"
)
async def get_enrollment(
    enrollment_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve a single enrollment record by ID.
    Accessible to admin, staff of section, or student if self.
    """
    return await EnrollmentService.get_enrollment_by_id(
        enrollment_id=enrollment_id, user=current_user
    )

@router.delete(
    "/{enrollment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Withdraw or remove student from section group"
)
async def withdraw_enrollment(
    enrollment_id: str,
    current_user=Depends(get_current_user),
):
    """
    Withdraw (drop) an enrollment.
    Allowed: By student before deadline, or by admin/staff at any time.
    """
    await EnrollmentService.withdraw_enrollment(enrollment_id=enrollment_id, user=current_user)
    return None

@router.get(
    "/section-group/{section_group_id}",
    response_model=List[EnrollmentResponse],
    summary="List enrollments for a section group (staff only)"
)
async def list_enrollments_for_section_group(
    section_group_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all enrollments for a section group.
    Only admin, professor, or associate teachers for the group.
    """
    return await EnrollmentService.list_enrollments_for_section_group(
        section_group_id=section_group_id, user=current_user
    )