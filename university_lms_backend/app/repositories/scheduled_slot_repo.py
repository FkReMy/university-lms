"""
ScheduledSlot Repository (Production)
-------------------------------------
Handles CRUD and query operations for scheduled slots (lectures, labs, exams time slots).

- No sample, demo, or test code.
- Uses global SQLAlchemy session and model patterns for system consistency.
"""

from sqlalchemy.orm import Session
from app.models.scheduled_slot import ScheduledSlot

class ScheduledSlotRepository:
    """
    Repository for CRUD and business queries on ScheduledSlot model.
    """

    @staticmethod
    def create(
        db: Session,
        course_offering_id: int,
        room_id: int,
        start_time,
        end_time,
        slot_type: str = "lecture",
        description: str = None
    ):
        """
        Create and persist a new scheduled slot (lecture, lab, exam).
        """
        slot = ScheduledSlot(
            course_offering_id=course_offering_id,
            room_id=room_id,
            start_time=start_time,
            end_time=end_time,
            slot_type=slot_type,
            description=description
        )
        db.add(slot)
        db.commit()
        db.refresh(slot)
        return slot

    @staticmethod
    def get_by_id(db: Session, slot_id: int):
        """
        Retrieve a scheduled slot by primary key.
        """
        return db.query(ScheduledSlot).filter(ScheduledSlot.slot_id == slot_id).first()

    @staticmethod
    def list_by_course_offering(db: Session, course_offering_id: int):
        """
        List all scheduled slots for a specific course offering.
        """
        return db.query(ScheduledSlot).filter(ScheduledSlot.course_offering_id == course_offering_id).all()

    @staticmethod
    def list_by_room(db: Session, room_id: int):
        """
        List all scheduled slots assigned to a particular room.
        """
        return db.query(ScheduledSlot).filter(ScheduledSlot.room_id == room_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all scheduled slots in the system.
        """
        return db.query(ScheduledSlot).all()

    @staticmethod
    def update(db: Session, slot_id: int, **kwargs):
        """
        Update attributes of a scheduled slot.
        """
        slot = db.query(ScheduledSlot).filter(ScheduledSlot.slot_id == slot_id).first()
        if not slot:
            return None
        for key, value in kwargs.items():
            setattr(slot, key, value)
        db.commit()
        db.refresh(slot)
        return slot

    @staticmethod
    def delete(db: Session, slot_id: int):
        """
        Delete a scheduled slot by primary key.
        """
        slot = db.query(ScheduledSlot).filter(ScheduledSlot.slot_id == slot_id).first()
        if not slot:
            return False
        db.delete(slot)
        db.commit()
        return True