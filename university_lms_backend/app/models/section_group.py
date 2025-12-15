"""
SectionGroup Model (Production)
-------------------------------
Represents a subdivision/grouping within a course offering (e.g., lab group, project team, recitation section).

- No sample, demo, or test fields or logic.
- Fully unified with global user, enrollment, and course offering models.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class SectionGroup(Base):
    """
    Database model for a group/subsection of students within a course offering.
    E.g., lab groups, recitation sections, project teams.
    """
    __tablename__ = "section_groups"

    section_group_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(128), nullable=False, index=True, doc="Group or section name, e.g., 'Lab A', 'Recitation 2'")
    description = Column(String(255), nullable=True, doc="Optional details about the section group")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    course_offering = relationship("CourseOffering", back_populates="section_groups")
    enrollments = relationship("Enrollment", back_populates="section_group", cascade="all, delete-orphan")

    def __repr__(self):
        return (
            f"<SectionGroup(section_group_id={self.section_group_id}, course_offering_id={self.course_offering_id}, name='{self.name}')>"
        )
    