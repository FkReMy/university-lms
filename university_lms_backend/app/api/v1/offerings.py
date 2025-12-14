"""
Course Offerings API Router (Production)
----------------------------------------
Manages course offerings (course offerings = a specific course offered in a specific academic session)
and section-group creation/listing for University LMS.

- All routes rely only on production unified schemas and services.
- All access validated by admin or localized (per department or staff).
- No samples, demos, or dev logic—real production code only.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.offering import (
    CourseOfferingCreate,
    CourseOfferingUpdate,
    CourseOfferingResponse,
)
from app.services.offering_service import CourseOfferingService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=CourseOfferingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a course offering (admin or department staff only)"
)
async def create_offering(
    offering: CourseOfferingCreate,
    current_user=Depends(get_current_user),
):
    """
    Create a new course offering for a department in an academic session.
    """
    return await CourseOfferingService.create_offering(
        data=offering, user=current_user
    )

@router.get(
    "/{offering_id}",
    response_model=CourseOfferingResponse,
    summary="Get an offering by ID"
)
async def get_offering(
    offering_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get a specific course offering by unique ID.
    """
    return await CourseOfferingService.get_offering_by_id(
        offering_id=offering_id, user=current_user
    )

@router.patch(
    "/{offering_id}",
    response_model=CourseOfferingResponse,
    summary="Update a course offering (admin/department staff only)"
)
async def update_offering(
    offering_id: str,
    offering_update: CourseOfferingUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update course offering details.
    Only allowed by admin, department admin/staff.
    """
    return await CourseOfferingService.update_offering(
        offering_id=offering_id, data=offering_update, user=current_user
    )

@router.delete(
    "/{offering_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a course offering (admin only)"
)
async def delete_offering(
    offering_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete (probably soft-delete) a course offering (admin only).
    """
    await CourseOfferingService.delete_offering(offering_id=offering_id, user=current_user)
    return None

@router.get(
    "/session/{session_id}",
    response_model=List[CourseOfferingResponse],
    summary="List all course offerings for an academic session"
)
async def list_offerings_in_session(
    session_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all offerings in a given academic session (for registration, search/admin).
    """
    return await CourseOfferingService.list_offerings_by_session(
        session_id=session_id, user=current_user
    )