"""
Assignments API Router (Production)
-----------------------------------
Handles all endpoints related to assignment management for university courses.

- Professors/Associate Teachers: create, update, list, and delete assignments.
- Students: list/list-detail of assignments for their enrolled sections.
- All access is strictly controlled by role and scopes.
- Uses unified schemas and service layer for validation and business logic.
- No samples, demos, or unclean code.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentResponse,
)
from app.services.assignment_service import AssignmentService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an assignment for a section group"
)
async def create_assignment(
    assignment: AssignmentCreate,
    current_user=Depends(get_current_user),
):
    """
    Create a new assignment for a section group.
    Only available to professors/associate teachers.
    """
    return await AssignmentService.create_assignment(
        data=assignment, user=current_user
    )

@router.get(
    "/{assignment_id}",
    response_model=AssignmentResponse,
    summary="Get assignment details by ID"
)
async def get_assignment(
    assignment_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get a specific assignment by its ID.
    Accessible by authorized staff and students of the section.
    """
    return await AssignmentService.get_assignment_by_id(
        assignment_id=assignment_id, user=current_user
    )

@router.patch(
    "/{assignment_id}",
    response_model=AssignmentResponse,
    summary="Update an assignment (staff only)"
)
async def update_assignment(
    assignment_id: str,
    assignment_update: AssignmentUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update assignment details.
    Only available to assignment creators (professor/associate teacher).
    """
    return await AssignmentService.update_assignment(
        assignment_id=assignment_id,
        data=assignment_update,
        user=current_user
    )

@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an assignment (staff only)"
)
async def delete_assignment(
    assignment_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete the assignment.
    Only allowed by the creator or admin, before deadline.
    """
    await AssignmentService.delete_assignment(
        assignment_id=assignment_id, user=current_user
    )
    return None

@router.get(
    "/section-group/{section_group_id}",
    response_model=List[AssignmentResponse],
    summary="List assignments for a section group"
)
async def list_assignments_for_section_group(
    section_group_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all assignments associated with a section group.
    Professor/Associate Teacher: for their sections.
    Students: for their enrolled section groups.
    """
    return await AssignmentService.list_assignments_by_section_group(
        section_group_id=section_group_id, user=current_user
    )