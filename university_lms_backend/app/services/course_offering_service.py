"""
CourseOffering Service (Production)
-----------------------------------
Service layer for managing CourseOffering entities, providing CRUD operations and business logic
for offered courses within the LMS context.

- No sample, demo, or test code.
- Utilizes global models, schemas, and adheres to unified project conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.course_offering import CourseOffering
from app.schemas.course_offering import (
    CourseOfferingCreate,
    CourseOfferingUpdate,
)
from app.schemas.course_offering import CourseOffering as CourseOfferingSchema

class CourseOfferingService:
    """
    Handles all CRUD and related business operations for course offerings.
    """

    @staticmethod
    def get_by_id(db: Session, course_offering_id: int) -> Optional[CourseOfferingSchema]:
        """
        Retrieve a course offering by its primary key.
        """
        offering_obj = db.query(CourseOffering).filter(CourseOffering.course_offering_id == course_offering_id).first()
        return CourseOfferingSchema.from_orm(offering_obj) if offering_obj else None

    @staticmethod
    def get_by_course_catalog_id(db: Session, course_catalog_id: int) -> List[CourseOfferingSchema]:
        """
        Retrieve all offerings for a specific course catalog entry.
        """
        offerings = db.query(CourseOffering).filter(CourseOffering.course_catalog_id == course_catalog_id).all()
        return [CourseOfferingSchema.from_orm(o) for o in offerings]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[CourseOfferingSchema]:
        """
        Retrieve all course offerings with pagination.
        """
        offerings = db.query(CourseOffering).offset(skip).limit(limit).all()
        return [CourseOfferingSchema.from_orm(o) for o in offerings]

    @staticmethod
    def create(db: Session, offering_in: CourseOfferingCreate) -> CourseOfferingSchema:
        """
        Create and persist a new course offering.
        """
        offering_obj = CourseOffering(**offering_in.dict())
        db.add(offering_obj)
        db.commit()
        db.refresh(offering_obj)
        return CourseOfferingSchema.from_orm(offering_obj)

    @staticmethod
    def update(
        db: Session,
        course_offering_id: int,
        offering_in: CourseOfferingUpdate
    ) -> Optional[CourseOfferingSchema]:
        """
        Update an existing course offering record.
        """
        offering_obj = db.query(CourseOffering).filter(CourseOffering.course_offering_id == course_offering_id).first()
        if not offering_obj:
            return None
        for field, value in offering_in.dict(exclude_unset=True).items():
            setattr(offering_obj, field, value)
        db.commit()
        db.refresh(offering_obj)
        return CourseOfferingSchema.from_orm(offering_obj)

    @staticmethod
    def delete(db: Session, course_offering_id: int) -> bool:
        """
        Delete a course offering by its ID. Returns True if deleted, False if not found.
        """
        offering_obj = db.query(CourseOffering).filter(CourseOffering.course_offering_id == course_offering_id).first()
        if not offering_obj:
            return False
        db.delete(offering_obj)
        db.commit()
        return True