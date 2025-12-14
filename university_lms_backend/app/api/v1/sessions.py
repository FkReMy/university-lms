"""
Academic Sessions API Router (Production)
-----------------------------------------
Manages academic session records in the University LMS (e.g., Fall 2025, Spring 2026).

- Admin can create, update, delete; all users may retrieve/list sessions.
- Endpoints use only unified, production-ready schemas and services.
- No samples, demos, or unvalidated logic.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.session import (
    AcademicSessionCreate,
    AcademicSessionUpdate,
    AcademicSessionResponse,
)
from app.services.session_service import AcademicSessionService
from app.core.auth import get_current_user

router = APIRouter()

@router.post(
    "/",
    response_model=AcademicSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an academic session (admin only)"
)
async def create_session(
    session: AcademicSessionCreate,
    current_user=Depends(get_current_user),
):
    """
    Create a new academic session. Admin only.
    """
    return await AcademicSessionService.create_session(session=session, user=current_user)

@router.get(
    "/",
    response_model=List[AcademicSessionResponse],
    summary="List all academic sessions"
)
async def list_sessions(
    current_user=Depends(get_current_user),
):
    """
    List all defined academic sessions.
    """
    return await AcademicSessionService.list_sessions(user=current_user)

@router.get(
    "/{session_id}",
    response_model=AcademicSessionResponse,
    summary="Get an academic session by ID"
)
async def get_session(
    session_id: str,
    current_user=Depends(get_current_user),
):
    """
    Retrieve a session by its database ID.
    """
    return await AcademicSessionService.get_session_by_id(session_id=session_id, user=current_user)

@router.patch(
    "/{session_id}",
    response_model=AcademicSessionResponse,
    summary="Update an academic session (admin only)"
)
async def update_session(
    session_id: str,
    session_update: AcademicSessionUpdate,
    current_user=Depends(get_current_user),
):
    """
    Update session data. Admin only.
    """
    return await AcademicSessionService.update_session(
        session_id=session_id, session_update=session_update, user=current_user
    )

@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an academic session (admin only)"
)
async def delete_session(
    session_id: str,
    current_user=Depends(get_current_user),
):
    """
    Delete a session by ID. Admin only.
    """
    await AcademicSessionService.delete_session(session_id=session_id, user=current_user)
    return None