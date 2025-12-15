"""
AcademicSession Repository (Production)
----------------------------------------
Implements data access methods for AcademicSession model.

- No sample/demo/test code included.
- Fully unified: all interactions use global database/session patterns.
"""

from sqlalchemy.orm import Session
from app.models.academic_session import AcademicSession

class AcademicSessionRepository:
    """
    Repository for AcademicSession data access (CRUD and business queries).
    """

    @staticmethod
    def create(db: Session, name: str, start_date, end_date, is_active: bool = True):
        """
        Create and persist a new academic session.
        """
        session = AcademicSession(
            name=name,
            start_date=start_date,
            end_date=end_date,
            is_active=is_active,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_by_id(db: Session, session_id: int):
        """
        Retrieve an academic session by primary key.
        """
        return db.query(AcademicSession).filter(AcademicSession.session_id == session_id).first()

    @staticmethod
    def get_active(db: Session):
        """
        Retrieve all active academic sessions.
        """
        return db.query(AcademicSession).filter(AcademicSession.is_active == True).all()

    @staticmethod
    def list_all(db: Session):
        """
        Retrieve all academic sessions.
        """
        return db.query(AcademicSession).order_by(AcademicSession.start_date.desc()).all()

    @staticmethod
    def update(db: Session, session_id: int, **kwargs):
        """
        Update an academic session identified by session_id.
        Accepts partial fields (name, start_date, end_date, is_active).
        """
        session = db.query(AcademicSession).filter(AcademicSession.session_id == session_id).first()
        if not session:
            return None
        for key, value in kwargs.items():
            setattr(session, key, value)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def delete(db: Session, session_id: int):
        """
        Delete an academic session by ID.
        """
        session = db.query(AcademicSession).filter(AcademicSession.session_id == session_id).first()
        if not session:
            return False
        db.delete(session)
        db.commit()
        return True