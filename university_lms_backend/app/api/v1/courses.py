"""
Courses API Router (Production)
-------------------------------
Handles endpoints for course catalog management, detail retrieval, and search,
for the University LMS.

- Only real, production logic (no demos/samples).
- All access controlled by role: admin, staff, or student scopes.
- Unified with domain schemas and service logic.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.course import (
    CourseCatalogResponse,
    CourseCreate,
    CourseUpdate,
    CourseResponse,
)
from app.services.course_service import CourseService
from app.core.auth import get_current_user

router = APIRouter()

@router.get(
    "/catalog",
    response_model=List[CourseCatalogResponse],
    summary="List all catalog courses"
)
async def list_catalog_courses(
    search: str = "",
    current_user=Depends(get_current_user),
):
    """
    List all courses available in the course catalog.
    Filtering and searching supported.
    """
    return await CourseService.list_catalog_courses(search=search, user=current_user)

@router.get(
    "/catalog/{course_code}",
    response_model=CourseCatalogResponse,
    summary="Get course catalog entry details"
)
async def get_catalog_course(
    course_code: str,
    current_user=Depends(get_current_user),
):
    """
    Get detailed info about a course in the catalog.
    """
    return await CourseService.get_catalog_course(course_code=course_code, user=current_user)

@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course (admin only)"
)
async def create_course(
    course: CourseCreate,
    current_user=Depends(get_current_user),
):
    """
    Admins can create new courses in the system.
    """
    return await CourseService.create_course(data=course, user=current_user)

@router.get(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Get course details by ID"
)
async def get_course(
    course_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve a course and its sections, staff, enrollment data etc.
    """
    return await CourseService.get_course_by_id(course_id=course_id, user=current_user)

@router.patch(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Update course information (admin only)"
)
async def update_course(
    course_id: str,
    course_update: CourseUpdate,
    current_user=Depends(get_current_user),
):
    """
    Admins can update core course info.
    """
    return await CourseService.update_course(
        course_id=course_id, data=course_update, user=current_user
    )

@router.delete(
    "/{course_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a course (admin only)"
)
async def delete_course(
    course_id: str,
    current_user=Depends(get_current_user),
):
    """
    Admins can (soft-)delete courses from the system.
    """
    await CourseService.delete_course(course_id=course_id, user=current_user)
    return None