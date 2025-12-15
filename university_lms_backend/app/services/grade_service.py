"""
Grade Service (Production)
--------------------------
Service layer for managing Grade entities, encapsulating CRUD operations and business policies for grades within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and system-wide conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.grade import Grade
from app.schemas.grade import (
    GradeCreate,
    GradeUpdate,
)
from app.schemas.grade import Grade as GradeSchema

class GradeService:
    """
    Handles CRUD and business operations for grade records.
    """

    @staticmethod
    def get_by_id(db: Session, grade_id: int) -> Optional[GradeSchema]:
        """
        Retrieve a grade by its unique identifier.
        """
        grade_obj = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        return GradeSchema.from_orm(grade_obj) if grade_obj else None

    @staticmethod
    def get_by_enrollment_id(db: Session, enrollment_id: int) -> List[GradeSchema]:
        """
        Retrieve all grades for a specific enrollment.
        """
        grades = db.query(Grade).filter(Grade.enrollment_id == enrollment_id).all()
        return [GradeSchema.from_orm(g) for g in grades]

    @staticmethod
    def get_by_assignment_id(db: Session, assignment_id: int) -> List[GradeSchema]:
        """
        Retrieve all grades for a specific assignment.
        """
        grades = db.query(Grade).filter(Grade.assignment_id == assignment_id).all()
        return [GradeSchema.from_orm(g) for g in grades]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[GradeSchema]:
        """
        Retrieve a paginated list of all grades.
        """
        grades = db.query(Grade).offset(skip).limit(limit).all()
        return [GradeSchema.from_orm(g) for g in grades]

    @staticmethod
    def create(db: Session, grade_in: GradeCreate) -> GradeSchema:
        """
        Create and persist a new grade record.
        """
        grade_obj = Grade(**grade_in.dict())
        db.add(grade_obj)
        db.commit()
        db.refresh(grade_obj)
        return GradeSchema.from_orm(grade_obj)

    @staticmethod
    def update(
        db: Session,
        grade_id: int,
        grade_in: GradeUpdate
    ) -> Optional[GradeSchema]:
        """
        Update an existing grade record with provided fields.
        """
        grade_obj = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not grade_obj:
            return None
        for field, value in grade_in.dict(exclude_unset=True).items():
            setattr(grade_obj, field, value)
        db.commit()
        db.refresh(grade_obj)
        return GradeSchema.from_orm(grade_obj)

    @staticmethod
    def delete(db: Session, grade_id: int) -> bool:
        """
        Delete a grade by its ID. Returns True if deleted, False if not found.
        """
        grade_obj = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not grade_obj:
            return False
        db.delete(grade_obj)
        db.commit()
        return True