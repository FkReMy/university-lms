"""
Departments API Router (Production)
-----------------------------------
Manages CRUD operations for academic departments in the University LMS.

- All endpoints use unified global schemas and services.
- Only production, real department operations (no sample/demo logic).
- Access control strictly enforced (admin for write, all users for read).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
)
from app.services.department_service import DepartmentService
from app.core.auth import get_current_user

router = APIRouter()

@router.get(
    "/",
    response_model=List[DepartmentResponse],
    summary="List all departments"
)
async def list_departments(current_user=Depends(get_current_user)):
    """
    Retrieve all departments.
    All users (students, staff) may view departments.
    """
    return await DepartmentService.list_departments(user=current_user)

@router.get(
    "/{dept_code}",
    response_model=DepartmentResponse,
    summary="Get a department by code"
)
async def get_department(
    dept_code: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve a department's information by its code.
    """
    return await DepartmentService.get_department_by_code(dept_code=dept_code, user=current_user)

@router.post(
    "/",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a department (admin only)"
)
async def create_department(
    department: DepartmentCreate,
    current_user=Depends(get_current_user),
):
    """
    Create a new academic department.
    Only admins can create.
    """
    return await DepartmentService.create_department(data=department, user=current_user)

@router.patch(
    "/{dept_code}",
    response_model=DepartmentResponse,
    summary="Update a department (admin only)"
)
async def update_department(
    dept_code: str,
    department_update: DepartmentUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update info for a department.
    Only admins can update.
    """
    return await DepartmentService.update_department(
        dept_code=dept_code, data=department_update, user=current_user
    )

@router.delete(
    "/{dept_code}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a department (admin only)"
)
async def delete_department(
    dept_code: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a department by code.
    Admins only; consider soft delete policy.
    """
    await DepartmentService.delete_department(dept_code=dept_code, user=current_user)
    return None