"""
Room Model (Production)
-----------------------
Represents a physical location (e.g., classroom, lab) used for university events.

- No sample, demo, or test fields/logics.
- Fully unified with upstream scheduling & event logic.
"""

from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Room(Base):
    """
    Database model for a university room used for events, classes, or exams.
    """
    __tablename__ = "rooms"

    room_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    code = Column(String(32), nullable=False, unique=True, index=True, doc="Room code, e.g., 'CS101', 'LAB5'")
    name = Column(String(128), nullable=False, doc="Room name, e.g., 'Main Comp Sci Lab'")
    building = Column(String(128), nullable=True, doc="Building name, e.g., 'Science Center'")
    capacity = Column(Integer, nullable=True, doc="Capacity of the room")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships (example: scheduled events/sections)
    # schedule_events = relationship("ScheduleEvent", back_populates="room")

    def __repr__(self):
        return f"<Room(room_id={self.room_id}, code='{self.code}', name='{self.name}')>"