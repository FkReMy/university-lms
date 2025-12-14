"""
Section Groups API Router (Production)
--------------------------------------
Manages section groups for course offerings in the University LMS.

- Professors/admins can create, update, delete, and list section groups.
- Students can view relevant section groups for their enrolled offerings.
- API uses only unified production schemas, global components, and consistent validation.
- No samples, demos, or test code.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.section_group import (
    SectionGroupCreate,
    SectionGroupUpdate,
    SectionGroupResponse,
)
from app.services.section_group_service import SectionGroupService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=SectionGroupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a section group (admin or department staff only)"
)
async def create_section_group(
    section_group: SectionGroupCreate,
    current_user=Depends(get_current_user),
):
    """
    Create a section group for a specific course offering.
    """
    return await SectionGroupService.create_section_group(
        data=section_group, user=current_user
    )

@router.get(
    "/{section_group_id}",
    response_model=SectionGroupResponse,
    summary="Get a section group by ID"
)
async def get_section_group(
    section_group_id: str,
    current_user=Depends(get_current_user),
):
    """
    Get a specific section group by unique ID.
    """
    return await SectionGroupService.get_section_group_by_id(
        section_group_id=section_group_id, user=current_user
    )

@router.patch(
    "/{section_group_id}",
    response_model=SectionGroupResponse,
    summary="Update a section group (admin/staff only)"
)
async def update_section_group(
    section_group_id: str,
    section_group_update: SectionGroupUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update section group details.
    Only admin/staff for that course offering may update.
    """
    return await SectionGroupService.update_section_group(
        section_group_id=section_group_id,
        section_group_update=section_group_update,
        user=current_user,
    )

@router.delete(
    "/{section_group_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a section group (admin only)"
)
async def delete_section_group(
    section_group_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete (possibly soft-delete) a section group.
    Only admins can delete.
    """
    await SectionGroupService.delete_section_group(section_group_id=section_group_id, user=current_user)
    return None

@router.get(
    "/offering/{offering_id}",
    response_model=List[SectionGroupResponse],
    summary="List all section groups for a course offering"
)
async def list_section_groups_for_offering(
    offering_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all section groups for a specific course offering.
    Staff & students of the offering have access.
    """
    return await SectionGroupService.list_section_groups_by_offering(
        offering_id=offering_id, user=current_user
    )