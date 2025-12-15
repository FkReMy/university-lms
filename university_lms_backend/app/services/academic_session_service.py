"""
AcademicSession Service (Production)
------------------------------------
Service layer for handling academic sessions in the LMS.
Provides CRUD operations and business logic for academic session data.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unification best practices for maintainability and scalability.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.academic_session import AcademicSession
from app.schemas.academic_session import (
    AcademicSessionCreate,
    AcademicSessionUpdate,
)
from app.schemas.academic_session import AcademicSession as AcademicSessionSchema

class AcademicSessionService:
    """
    Encapsulates all logic for AcademicSession operations.
    """

    @staticmethod
    def get_by_id(db: Session, session_id: int) -> Optional[AcademicSessionSchema]:
        """
        Retrieve an academic session by its primary key.
        """
        session = db.query(AcademicSession).filter(AcademicSession.academic_session_id == session_id).first()
        return AcademicSessionSchema.from_orm(session) if session else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[AcademicSessionSchema]:
        """
        Retrieve all academic sessions, with pagination.
        """
        sessions = db.query(AcademicSession).offset(skip).limit(limit).all()
        return [AcademicSessionSchema.from_orm(s) for s in sessions]

    @staticmethod
    def create(db: Session, session_in: AcademicSessionCreate) -> AcademicSessionSchema:
        """
        Create and persist an academic session.
        """
        session_obj = AcademicSession(**session_in.dict())
        db.add(session_obj)
        db.commit()
        db.refresh(session_obj)
        return AcademicSessionSchema.from_orm(session_obj)

    @staticmethod
    def update(
        db: Session,
        session_id: int,
        session_in: AcademicSessionUpdate
    ) -> Optional[AcademicSessionSchema]:
        """
        Update an existing academic session.
        """
        session_obj = db.query(AcademicSession).filter(AcademicSession.academic_session_id == session_id).first()
        if not session_obj:
            return None
        for field, value in session_in.dict(exclude_unset=True).items():
            setattr(session_obj, field, value)
        db.commit()
        db.refresh(session_obj)
        return AcademicSessionSchema.from_orm(session_obj)

    @staticmethod
    def delete(db: Session, session_id: int) -> bool:
        """
        Delete an academic session by its ID.
        Returns True if deleted, False if not found.
        """
        session_obj = db.query(AcademicSession).filter(AcademicSession.academic_session_id == session_id).first()
        if not session_obj:
            return False
        db.delete(session_obj)
        db.commit()
        return True