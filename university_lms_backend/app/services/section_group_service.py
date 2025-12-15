"""
SectionGroup Service (Production)
---------------------------------
Service layer for managing SectionGroup entities, providing
CRUD operations and business logic for section groups within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.section_group import SectionGroup
from app.schemas.section_group import (
    SectionGroupCreate,
    SectionGroupUpdate,
)
from app.schemas.section_group import SectionGroup as SectionGroupSchema

class SectionGroupService:
    """
    Handles CRUD and business operations for section groups.
    """

    @staticmethod
    def get_by_id(db: Session, section_group_id: int) -> Optional[SectionGroupSchema]:
        """
        Retrieve a section group by its unique identifier.
        """
        group_obj = db.query(SectionGroup).filter(SectionGroup.section_group_id == section_group_id).first()
        return SectionGroupSchema.from_orm(group_obj) if group_obj else None

    @staticmethod
    def get_by_course_offering_id(db: Session, course_offering_id: int) -> List[SectionGroupSchema]:
        """
        Retrieve all section groups for a given course offering.
        """
        groups = db.query(SectionGroup).filter(SectionGroup.course_offering_id == course_offering_id).all()
        return [SectionGroupSchema.from_orm(g) for g in groups]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[SectionGroupSchema]:
        """
        Retrieve a paginated list of all section groups.
        """
        groups = db.query(SectionGroup).offset(skip).limit(limit).all()
        return [SectionGroupSchema.from_orm(g) for g in groups]

    @staticmethod
    def create(db: Session, group_in: SectionGroupCreate) -> SectionGroupSchema:
        """
        Create and persist a new section group record.
        """
        group_obj = SectionGroup(**group_in.dict())
        db.add(group_obj)
        db.commit()
        db.refresh(group_obj)
        return SectionGroupSchema.from_orm(group_obj)

    @staticmethod
    def update(
        db: Session,
        section_group_id: int,
        group_in: SectionGroupUpdate
    ) -> Optional[SectionGroupSchema]:
        """
        Update an existing section group with provided fields.
        """
        group_obj = db.query(SectionGroup).filter(SectionGroup.section_group_id == section_group_id).first()
        if not group_obj:
            return None
        for field, value in group_in.dict(exclude_unset=True).items():
            setattr(group_obj, field, value)
        db.commit()
        db.refresh(group_obj)
        return SectionGroupSchema.from_orm(group_obj)

    @staticmethod
    def delete(db: Session, section_group_id: int) -> bool:
        """
        Delete a section group by its ID. Returns True if deleted, False if not found.
        """
        group_obj = db.query(SectionGroup).filter(SectionGroup.section_group_id == section_group_id).first()
        if not group_obj:
            return False
        db.delete(group_obj)
        db.commit()
        return True