"""
SectionGroup Repository (Production)
------------------------------------
Handles CRUD and queries for section groups (e.g., grouping students for labs/discussion/TA sections).

- No sample, demo, or test code.
- Consistent use of global SQLAlchemy ORM models and session.
"""

from sqlalchemy.orm import Session
from app.models.section_group import SectionGroup

class SectionGroupRepository:
    """
    Repository for operations on SectionGroup entities.
    """

    @staticmethod
    def create(
        db: Session,
        course_offering_id: int,
        name: str,
        description: str = None,
        instructor_id: int = None
    ):
        """
        Create and persist a new section group.
        """
        group = SectionGroup(
            course_offering_id=course_offering_id,
            name=name,
            description=description,
            instructor_id=instructor_id,
        )
        db.add(group)
        db.commit()
        db.refresh(group)
        return group

    @staticmethod
    def get_by_id(db: Session, group_id: int):
        """
        Retrieve a section group by primary key.
        """
        return db.query(SectionGroup).filter(SectionGroup.group_id == group_id).first()

    @staticmethod
    def list_by_course_offering(db: Session, course_offering_id: int):
        """
        List all section groups for a given course offering.
        """
        return db.query(SectionGroup).filter(SectionGroup.course_offering_id == course_offering_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all section groups in the system.
        """
        return db.query(SectionGroup).all()

    @staticmethod
    def update(db: Session, group_id: int, **kwargs):
        """
        Update fields of a section group by dictionary of values.
        """
        group = db.query(SectionGroup).filter(SectionGroup.group_id == group_id).first()
        if not group:
            return None
        for key, value in kwargs.items():
            setattr(group, key, value)
        db.commit()
        db.refresh(group)
        return group

    @staticmethod
    def delete(db: Session, group_id: int):
        """
        Delete a section group by primary key.
        """
        group = db.query(SectionGroup).filter(SectionGroup.group_id == group_id).first()
        if not group:
            return False
        db.delete(group)
        db.commit()
        return True