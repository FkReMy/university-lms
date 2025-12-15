"""
Professor Repository (Production)
---------------------------------
Handles CRUD operations and queries for Professor model (faculty staff).

- No sample, demo, or test code.
- Fully uses global SQLAlchemy models and session management.
"""

from sqlalchemy.orm import Session
from app.models.professor import Professor

class ProfessorRepository:
    """
    Repository for CRUD and business queries on Professor entities.
    """

    @staticmethod
    def create(db: Session, user_id: int, department_id: int, hire_date = None, status: str = "active"):
        """
        Create and persist a new professor.
        """
        professor = Professor(
            user_id=user_id,
            department_id=department_id,
            hire_date=hire_date,
            status=status,
        )
        db.add(professor)
        db.commit()
        db.refresh(professor)
        return professor

    @staticmethod
    def get_by_id(db: Session, professor_id: int):
        """
        Load professor by primary key.
        """
        return db.query(Professor).filter(Professor.professor_id == professor_id).first()

    @staticmethod
    def get_by_user_id(db: Session, user_id: int):
        """
        Find professor by user account id.
        """
        return db.query(Professor).filter(Professor.user_id == user_id).first()

    @staticmethod
    def list_by_department(db: Session, department_id: int):
        """
        List all professors in a department.
        """
        return db.query(Professor).filter(Professor.department_id == department_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all professors.
        """
        return db.query(Professor).all()

    @staticmethod
    def update(db: Session, professor_id: int, **kwargs):
        """
        Update a professor with new field values.
        """
        professor = db.query(Professor).filter(Professor.professor_id == professor_id).first()
        if not professor:
            return None
        for key, value in kwargs.items():
            setattr(professor, key, value)
        db.commit()
        db.refresh(professor)
        return professor

    @staticmethod
    def delete(db: Session, professor_id: int):
        """
        Delete a professor by primary key.
        """
        professor = db.query(Professor).filter(Professor.professor_id == professor_id).first()
        if not professor:
            return False
        db.delete(professor)
        db.commit()
        return True