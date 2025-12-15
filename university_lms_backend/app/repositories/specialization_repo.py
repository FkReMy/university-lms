"""
Specialization Repository (Production)
--------------------------------------
Handles CRUD and query operations for specializations (majors, minors, tracks) in the university system.

- No sample, demo, or test code.
- Consistent use of global SQLAlchemy models and session for all persistence operations.
"""

from sqlalchemy.orm import Session
from app.models.specialization import Specialization

class SpecializationRepository:
    """
    Repository for all business logic and CRUD for Specialization entities.
    """

    @staticmethod
    def create(db: Session, name: str, code: str = None, description: str = None, department_id: int = None):
        """
        Create and persist a new specialization.
        """
        specialization = Specialization(
            name=name,
            code=code,
            description=description,
            department_id=department_id
        )
        db.add(specialization)
        db.commit()
        db.refresh(specialization)
        return specialization

    @staticmethod
    def get_by_id(db: Session, specialization_id: int):
        """
        Retrieve a specialization by its primary key.
        """
        return db.query(Specialization).filter(Specialization.specialization_id == specialization_id).first()

    @staticmethod
    def get_by_code(db: Session, code: str):
        """
        Retrieve a specialization by its unique code.
        """
        return db.query(Specialization).filter(Specialization.code == code).first()

    @staticmethod
    def list_by_department(db: Session, department_id: int):
        """
        List all specializations that belong to a department.
        """
        return db.query(Specialization).filter(Specialization.department_id == department_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all specializations in the system.
        """
        return db.query(Specialization).all()

    @staticmethod
    def update(db: Session, specialization_id: int, **kwargs):
        """
        Update any field(s) of a specialization entry.
        """
        specialization = db.query(Specialization).filter(Specialization.specialization_id == specialization_id).first()
        if not specialization:
            return None
        for key, value in kwargs.items():
            setattr(specialization, key, value)
        db.commit()
        db.refresh(specialization)
        return specialization

    @staticmethod
    def delete(db: Session, specialization_id: int):
        """
        Delete a specialization by its primary key.
        """
        specialization = db.query(Specialization).filter(Specialization.specialization_id == specialization_id).first()
        if not specialization:
            return False
        db.delete(specialization)
        db.commit()
        return True