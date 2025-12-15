"""
Professor Service (Production)
------------------------------
Service layer for managing Professor entities, handling CRUD operations and business logic for faculty members within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified system architecture.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.professor import Professor
from app.schemas.professor import (
    ProfessorCreate,
    ProfessorUpdate,
)
from app.schemas.professor import Professor as ProfessorSchema

class ProfessorService:
    """
    Handles CRUD and business operations for professors.
    """

    @staticmethod
    def get_by_id(db: Session, professor_id: int) -> Optional[ProfessorSchema]:
        """
        Retrieve a professor by their unique identifier.
        """
        professor_obj = db.query(Professor).filter(Professor.professor_id == professor_id).first()
        return ProfessorSchema.from_orm(professor_obj) if professor_obj else None

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[ProfessorSchema]:
        """
        Retrieve a professor by the linked user account's ID.
        """
        professor_obj = db.query(Professor).filter(Professor.user_id == user_id).first()
        return ProfessorSchema.from_orm(professor_obj) if professor_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[ProfessorSchema]:
        """
        Retrieve a paginated list of all professors.
        """
        professors = db.query(Professor).offset(skip).limit(limit).all()
        return [ProfessorSchema.from_orm(p) for p in professors]

    @staticmethod
    def create(db: Session, professor_in: ProfessorCreate) -> ProfessorSchema:
        """
        Create and persist a new professor record.
        """
        professor_obj = Professor(**professor_in.dict())
        db.add(professor_obj)
        db.commit()
        db.refresh(professor_obj)
        return ProfessorSchema.from_orm(professor_obj)

    @staticmethod
    def update(
        db: Session,
        professor_id: int,
        professor_in: ProfessorUpdate
    ) -> Optional[ProfessorSchema]:
        """
        Update an existing professor record with provided fields.
        """
        professor_obj = db.query(Professor).filter(Professor.professor_id == professor_id).first()
        if not professor_obj:
            return None
        for field, value in professor_in.dict(exclude_unset=True).items():
            setattr(professor_obj, field, value)
        db.commit()
        db.refresh(professor_obj)
        return ProfessorSchema.from_orm(professor_obj)

    @staticmethod
    def delete(db: Session, professor_id: int) -> bool:
        """
        Delete a professor by their ID. Returns True if deleted, False if not found.
        """
        professor_obj = db.query(Professor).filter(Professor.professor_id == professor_id).first()
        if not professor_obj:
            return False
        db.delete(professor_obj)
        db.commit()
        return True