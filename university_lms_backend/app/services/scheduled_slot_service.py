"""
ScheduledSlot Service (Production)
----------------------------------
Service layer for managing ScheduledSlot entities, providing CRUD operations and
business logic for scheduled time slots within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.scheduled_slot import ScheduledSlot
from app.schemas.scheduled_slot import (
    ScheduledSlotCreate,
    ScheduledSlotUpdate,
)
from app.schemas.scheduled_slot import ScheduledSlot as ScheduledSlotSchema

class ScheduledSlotService:
    """
    Handles CRUD and business operations for scheduled slots.
    """

    @staticmethod
    def get_by_id(db: Session, scheduled_slot_id: int) -> Optional[ScheduledSlotSchema]:
        """
        Retrieve a scheduled slot by its unique identifier.
        """
        slot_obj = db.query(ScheduledSlot).filter(ScheduledSlot.scheduled_slot_id == scheduled_slot_id).first()
        return ScheduledSlotSchema.from_orm(slot_obj) if slot_obj else None

    @staticmethod
    def get_by_course_offering_id(db: Session, course_offering_id: int) -> List[ScheduledSlotSchema]:
        """
        Retrieve all scheduled slots for a given course offering.
        """
        slots = db.query(ScheduledSlot).filter(ScheduledSlot.course_offering_id == course_offering_id).all()
        return [ScheduledSlotSchema.from_orm(s) for s in slots]

    @staticmethod
    def get_by_room_id(db: Session, room_id: int) -> List[ScheduledSlotSchema]:
        """
        Retrieve all scheduled slots for a given room.
        """
        slots = db.query(ScheduledSlot).filter(ScheduledSlot.room_id == room_id).all()
        return [ScheduledSlotSchema.from_orm(s) for s in slots]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[ScheduledSlotSchema]:
        """
        Retrieve a paginated list of all scheduled slots.
        """
        slots = db.query(ScheduledSlot).offset(skip).limit(limit).all()
        return [ScheduledSlotSchema.from_orm(s) for s in slots]

    @staticmethod
    def create(db: Session, slot_in: ScheduledSlotCreate) -> ScheduledSlotSchema:
        """
        Create and persist a new scheduled slot record.
        """
        slot_obj = ScheduledSlot(**slot_in.dict())
        db.add(slot_obj)
        db.commit()
        db.refresh(slot_obj)
        return ScheduledSlotSchema.from_orm(slot_obj)

    @staticmethod
    def update(
        db: Session,
        scheduled_slot_id: int,
        slot_in: ScheduledSlotUpdate
    ) -> Optional[ScheduledSlotSchema]:
        """
        Update an existing scheduled slot with provided fields.
        """
        slot_obj = db.query(ScheduledSlot).filter(ScheduledSlot.scheduled_slot_id == scheduled_slot_id).first()
        if not slot_obj:
            return None
        for field, value in slot_in.dict(exclude_unset=True).items():
            setattr(slot_obj, field, value)
        db.commit()
        db.refresh(slot_obj)
        return ScheduledSlotSchema.from_orm(slot_obj)

    @staticmethod
    def delete(db: Session, scheduled_slot_id: int) -> bool:
        """
        Delete a scheduled slot by its ID. Returns True if deleted, False if not found.
        """
        slot_obj = db.query(ScheduledSlot).filter(ScheduledSlot.scheduled_slot_id == scheduled_slot_id).first()
        if not slot_obj:
            return False
        db.delete(slot_obj)
        db.commit()
        return True