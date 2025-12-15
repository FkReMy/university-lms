"""
Specialization Service (Production)
-----------------------------------
Service layer for managing Specialization entities, providing CRUD operations
and business logic for areas of specialization within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.specialization import Specialization
from app.schemas.specialization import (
    SpecializationCreate,
    SpecializationUpdate,
)
from app.schemas.specialization import Specialization as SpecializationSchema

class SpecializationService:
    """
    Handles CRUD and business operations for specializations.
    """

    @staticmethod
    def get_by_id(db: Session, specialization_id: int) -> Optional[SpecializationSchema]:
        """
        Retrieve a specialization by its unique identifier.
        """
        spec_obj = db.query(Specialization).filter(Specialization.specialization_id == specialization_id).first()
        return SpecializationSchema.from_orm(spec_obj) if spec_obj else None

    @staticmethod
    def get_by_department_id(db: Session, department_id: int) -> List[SpecializationSchema]:
        """
        Retrieve all specializations for a given department.
        """
        specs = db.query(Specialization).filter(Specialization.department_id == department_id).all()
        return [SpecializationSchema.from_orm(s) for s in specs]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[SpecializationSchema]:
        """
        Retrieve a paginated list of all specializations.
        """
        specs = db.query(Specialization).offset(skip).limit(limit).all()
        return [SpecializationSchema.from_orm(s) for s in specs]

    @staticmethod
    def create(db: Session, spec_in: SpecializationCreate) -> SpecializationSchema:
        """
        Create and persist a new specialization record.
        """
        spec_obj = Specialization(**spec_in.dict())
        db.add(spec_obj)
        db.commit()
        db.refresh(spec_obj)
        return SpecializationSchema.from_orm(spec_obj)

    @staticmethod
    def update(
        db: Session,
        specialization_id: int,
        spec_in: SpecializationUpdate
    ) -> Optional[SpecializationSchema]:
        """
        Update an existing specialization with provided fields.
        """
        spec_obj = db.query(Specialization).filter(Specialization.specialization_id == specialization_id).first()
        if not spec_obj:
            return None
        for field, value in spec_in.dict(exclude_unset=True).items():
            setattr(spec_obj, field, value)
        db.commit()
        db.refresh(spec_obj)
        return SpecializationSchema.from_orm(spec_obj)

    @staticmethod
    def delete(db: Session, specialization_id: int) -> bool:
        """
        Delete a specialization by its ID. Returns True if deleted, False if not found.
        """
        spec_obj = db.query(Specialization).filter(Specialization.specialization_id == specialization_id).first()
        if not spec_obj:
            return False
        db.delete(spec_obj)
        db.commit()
        return True