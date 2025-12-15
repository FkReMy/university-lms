"""
ScheduledSlot Model (Production)
--------------------------------
Represents a scheduled time slot for a course, lab, or event within the university's calendar.

- No sample, demo, or test fields or logic.
- Fully unified with global course offering, room, and staff models.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Time, Enum, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class ScheduledSlot(Base):
    """
    Database model for a scheduled session (lecture, lab, seminar) in the university timetable.
    """
    __tablename__ = "scheduled_slots"

    slot_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)
    room_id = Column(Integer, ForeignKey("rooms.room_id", ondelete="SET NULL"), nullable=True, index=True)
    professor_id = Column(Integer, ForeignKey("professors.professor_id", ondelete="SET NULL"), nullable=True, index=True)

    day_of_week = Column(String(16), nullable=False, doc="Day of the week e.g., Monday, Tuesday")
    start_time = Column(Time, nullable=False, doc="Session start time")
    end_time = Column(Time, nullable=False, doc="Session end time")
    slot_type = Column(String(32), nullable=False, doc="Type of slot: lecture, lab, seminar, etc.")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    course_offering = relationship("CourseOffering")
    room = relationship("Room")
    professor = relationship("Professor")

    def __repr__(self):
        return (
            f"<ScheduledSlot(slot_id={self.slot_id}, course_offering_id={self.course_offering_id}, day_of_week='{self.day_of_week}', start_time={self.start_time})>"
        )