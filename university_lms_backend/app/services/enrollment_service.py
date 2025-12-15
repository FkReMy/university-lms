"""
Enrollment Service (Production)
-------------------------------
Service layer for managing Enrollment entities, encapsulating CRUD operations
and business logic for student enrollments in course offerings.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified best practices.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.enrollment import Enrollment
from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentUpdate,
)
from app.schemas.enrollment import Enrollment as EnrollmentSchema

class EnrollmentService:
    """
    Handles CRUD and business operations for student enrollments.
    """

    @staticmethod
    def get_by_id(db: Session, enrollment_id: int) -> Optional[EnrollmentSchema]:
        """
        Retrieve an enrollment by its unique identifier.
        """
        enrollment_obj = db.query(Enrollment).filter(Enrollment.enrollment_id == enrollment_id).first()
        return EnrollmentSchema.from_orm(enrollment_obj) if enrollment_obj else None

    @staticmethod
    def get_by_student_id(db: Session, student_id: int) -> List[EnrollmentSchema]:
        """
        Retrieve all enrollments for a given student.
        """
        enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
        return [EnrollmentSchema.from_orm(e) for e in enrollments]

    @staticmethod
    def get_by_course_offering_id(db: Session, course_offering_id: int) -> List[EnrollmentSchema]:
        """
        Retrieve all enrollments for a specific course offering.
        """
        enrollments = db.query(Enrollment).filter(Enrollment.course_offering_id == course_offering_id).all()
        return [EnrollmentSchema.from_orm(e) for e in enrollments]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[EnrollmentSchema]:
        """
        Retrieve a paginated list of all enrollments.
        """
        enrollments = db.query(Enrollment).offset(skip).limit(limit).all()
        return [EnrollmentSchema.from_orm(e) for e in enrollments]

    @staticmethod
    def create(db: Session, enrollment_in: EnrollmentCreate) -> EnrollmentSchema:
        """
        Create and persist a new enrollment.
        """
        enrollment_obj = Enrollment(**enrollment_in.dict())
        db.add(enrollment_obj)
        db.commit()
        db.refresh(enrollment_obj)
        return EnrollmentSchema.from_orm(enrollment_obj)

    @staticmethod
    def update(
        db: Session,
        enrollment_id: int,
        enrollment_in: EnrollmentUpdate
    ) -> Optional[EnrollmentSchema]:
        """
        Update an existing enrollment entry with provided fields.
        """
        enrollment_obj = db.query(Enrollment).filter(Enrollment.enrollment_id == enrollment_id).first()
        if not enrollment_obj:
            return None
        for field, value in enrollment_in.dict(exclude_unset=True).items():
            setattr(enrollment_obj, field, value)
        db.commit()
        db.refresh(enrollment_obj)
        return EnrollmentSchema.from_orm(enrollment_obj)

    @staticmethod
    def delete(db: Session, enrollment_id: int) -> bool:
        """
        Delete an enrollment by its ID. Returns True if deleted, False if not found.
        """
        enrollment_obj = db.query(Enrollment).filter(Enrollment.enrollment_id == enrollment_id).first()
        if not enrollment_obj:
            return False
        db.delete(enrollment_obj)
        db.commit()
        return True