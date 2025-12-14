"""
Roles API Router (Production)
-----------------------------
Manages user roles and their assignments within the University LMS.

- Only uses unified schemas/services and validated access policies.
- Admins can create, update, delete, and assign roles.
- All users can list their own roles; only admins manage roles for others.
- Pure production code (no sample/demo logic).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.role import (
    RoleCreate,
    RoleUpdate,
    RoleResponse,
    UserRoleAssignRequest,
    UserRoleRevokeRequest,
    UserRoleResponse,
)
from app.services.role_service import RoleService
from app.core.auth import get_current_user

router = APIRouter()

@router.get(
    "/",
    response_model=List[RoleResponse],
    summary="List all roles (admin only)"
)
async def list_roles(current_user=Depends(get_current_user)):
    """
    List all defined roles in the system.
    Only accessible by admin users.
    """
    return await RoleService.list_roles(user=current_user)

@router.get(
    "/me",
    response_model=List[UserRoleResponse],
    summary="List all roles assigned to the current user"
)
async def list_my_roles(current_user=Depends(get_current_user)):
    """
    List all roles for the currently authenticated user.
    """
    return await RoleService.list_user_roles(user_id=current_user.id, user=current_user)

@router.get(
    "/user/{user_id}",
    response_model=List[UserRoleResponse],
    summary="List all roles assigned to a specific user (admin only)"
)
async def list_user_roles(
    user_id: str,
    current_user=Depends(get_current_user),
):
    """
    List all roles for the specified user.
    Only accessible by admins.
    """
    return await RoleService.list_user_roles(user_id=user_id, user=current_user)

@router.post(
    "/",
    response_model=RoleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new role (admin only)"
)
async def create_role(
    role: RoleCreate,
    current_user=Depends(get_current_user),
):
    """
    Create a new global/system-wide role.
    Only accessible by admins.
    """
    return await RoleService.create_role(role=role, user=current_user)

@router.patch(
    "/{role_id}",
    response_model=RoleResponse,
    summary="Update a role (admin only)"
)
async def update_role(
    role_id: str,
    role_update: RoleUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update a role's permissions or metadata.
    Only accessible by admins.
    """
    return await RoleService.update_role(role_id=role_id, role_update=role_update, user=current_user)

@router.delete(
    "/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a role (admin only)"
)
async def delete_role(
    role_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a role by ID.
    Only accessible by admins.
    """
    await RoleService.delete_role(role_id=role_id, user=current_user)
    return None

@router.post(
    "/assign",
    response_model=UserRoleResponse,
    summary="Assign a role to a user (admin only)"
)
async def assign_role(
    assignment: UserRoleAssignRequest,
    current_user=Depends(get_current_user),
):
    """
    Assign a role to a user.
    Only accessible by admins.
    """
    return await RoleService.assign_role(assignment=assignment, user=current_user)

@router.post(
    "/revoke",
    response_model=UserRoleResponse,
    summary="Revoke a role from a user (admin only)"
)
async def revoke_role(
    revoke_request: UserRoleRevokeRequest,
    current_user=Depends(get_current_user),
):
    """
    Revoke a role from a user.
    Only accessible by admins.
    """
    return await RoleService.revoke_role(revoke_request=revoke_request, user=current_user)