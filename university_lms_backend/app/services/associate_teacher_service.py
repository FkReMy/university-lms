"""
AssociateTeacher Service (Production)
-------------------------------------
Service layer for managing association of teachers with course offerings in the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and follows unified best practices for maintainable architecture.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.associate_teacher import AssociateTeacher
from app.schemas.associate_teacher import (
    AssociateTeacherCreate,
    AssociateTeacherUpdate,
)
from app.schemas.associate_teacher import AssociateTeacher as AssociateTeacherSchema

class AssociateTeacherService:
    """
    Handles CRUD operations and business logic for teacher-course associations.
    """

    @staticmethod
    def get_by_id(db: Session, associate_teacher_id: int) -> Optional[AssociateTeacherSchema]:
        """
        Retrieve an association by its unique identifier.
        """
        assoc = db.query(AssociateTeacher).filter(AssociateTeacher.associate_teacher_id == associate_teacher_id).first()
        return AssociateTeacherSchema.from_orm(assoc) if assoc else None

    @staticmethod
    def get_by_teacher_id(db: Session, teacher_id: int) -> List[AssociateTeacherSchema]:
        """
        Retrieve all associations for a specific teacher.
        """
        assocs = db.query(AssociateTeacher).filter(AssociateTeacher.teacher_id == teacher_id).all()
        return [AssociateTeacherSchema.from_orm(a) for a in assocs]

    @staticmethod
    def get_by_course_offering_id(db: Session, course_offering_id: int) -> List[AssociateTeacherSchema]:
        """
        Retrieve all teacher associations for a given course offering.
        """
        assocs = db.query(AssociateTeacher).filter(AssociateTeacher.course_offering_id == course_offering_id).all()
        return [AssociateTeacherSchema.from_orm(a) for a in assocs]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[AssociateTeacherSchema]:
        """
        Retrieve a paginated list of all teacher associations.
        """
        assocs = db.query(AssociateTeacher).offset(skip).limit(limit).all()
        return [AssociateTeacherSchema.from_orm(a) for a in assocs]

    @staticmethod
    def create(db: Session, assoc_in: AssociateTeacherCreate) -> AssociateTeacherSchema:
        """
        Create and persist a new teacher-course association.
        """
        assoc_obj = AssociateTeacher(**assoc_in.dict())
        db.add(assoc_obj)
        db.commit()
        db.refresh(assoc_obj)
        return AssociateTeacherSchema.from_orm(assoc_obj)

    @staticmethod
    def update(
        db: Session,
        associate_teacher_id: int,
        assoc_in: AssociateTeacherUpdate
    ) -> Optional[AssociateTeacherSchema]:
        """
        Update details of an existing teacher-course association.
        """
        assoc_obj = db.query(AssociateTeacher).filter(AssociateTeacher.associate_teacher_id == associate_teacher_id).first()
        if not assoc_obj:
            return None
        for field, value in assoc_in.dict(exclude_unset=True).items():
            setattr(assoc_obj, field, value)
        db.commit()
        db.refresh(assoc_obj)
        return AssociateTeacherSchema.from_orm(assoc_obj)

    @staticmethod
    def delete(db: Session, associate_teacher_id: int) -> bool:
        """
        Delete an association by its ID. Returns True if deleted, False if not found.
        """
        assoc_obj = db.query(AssociateTeacher).filter(AssociateTeacher.associate_teacher_id == associate_teacher_id).first()
        if not assoc_obj:
            return False
        db.delete(assoc_obj)
        db.commit()
        return True