"""
AcademicSession Model (Production)
----------------------------------
Represents a university-wide academic period (e.g., "2024-2025 Fall"), for grouping course offerings and enrollments.

- No demo/sample fields, only real production data.
- Unified with global system standards (timestamps, foreign keys, audit).
"""

from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class AcademicSession(Base):
    """
    Database model for academic sessions.
    Each session represents a term/year, which can be used for scheduling and organizational context.
    """
    __tablename__ = "academic_sessions"
    
    session_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(64), nullable=False, unique=True, index=True, doc="e.g., '2024-2025 Fall'")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships (unified, real-world references)
    course_offerings = relationship("CourseOffering", back_populates="academic_session")

    def __repr__(self):
        return f"<AcademicSession(session_id={self.session_id}, name='{self.name}')>"