"""
CourseOffering Repository (Production)
--------------------------------------
Handles data access operations for CourseOffering entities representing term-specific course instances.

- No sample, demo, or test code.
- All DB actions use global models and transaction/session management.
"""

from sqlalchemy.orm import Session
from app.models.course_offering import CourseOffering

class CourseOfferingRepository:
    """
    Repository for CRUD and queries on CourseOffering entities.
    """

    @staticmethod
    def create(db: Session, catalog_id: int, academic_session_id: int, section: str = None, instructor_id: int = None, capacity: int = 0, status: str = "open"):
        """
        Create and save a new course offering for a particular term/session.
        """
        offering = CourseOffering(
            catalog_id=catalog_id,
            academic_session_id=academic_session_id,
            section=section,
            instructor_id=instructor_id,
            capacity=capacity,
            status=status,
        )
        db.add(offering)
        db.commit()
        db.refresh(offering)
        return offering

    @staticmethod
    def get_by_id(db: Session, offering_id: int):
        """
        Get course offering by primary key.
        """
        return db.query(CourseOffering).filter(CourseOffering.offering_id == offering_id).first()

    @staticmethod
    def list_by_catalog(db: Session, catalog_id: int):
        """
        List all offerings of a course catalog entry.
        """
        return db.query(CourseOffering).filter(CourseOffering.catalog_id == catalog_id).all()

    @staticmethod
    def list_by_academic_session(db: Session, academic_session_id: int):
        """
        List all course offerings in a given academic session/term.
        """
        return db.query(CourseOffering).filter(CourseOffering.academic_session_id == academic_session_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all course offerings.
        """
        return db.query(CourseOffering).all()

    @staticmethod
    def update(db: Session, offering_id: int, **kwargs):
        """
        Update an offering; supports partial update by kwargs.
        """
        offering = db.query(CourseOffering).filter(CourseOffering.offering_id == offering_id).first()
        if not offering:
            return None
        for key, value in kwargs.items():
            setattr(offering, key, value)
        db.commit()
        db.refresh(offering)
        return offering

    @staticmethod
    def delete(db: Session, offering_id: int):
        """
        Delete a course offering by its primary key.
        """
        offering = db.query(CourseOffering).filter(CourseOffering.offering_id == offering_id).first()
        if not offering:
            return False
        db.delete(offering)
        db.commit()
        return True