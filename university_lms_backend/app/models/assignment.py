"""
Assignment Model (Production)
-----------------------------
Represents an assignment for a course offering in the university LMS.

- No sample or demo fields/logic. All fields are real and production-ready.
- Linked to course offering and supports global audit/unified file/relationship patterns.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime, Date, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Assignment(Base):
    """
    Database model for assignments in a course offering.
    """
    __tablename__ = "assignments"

    assignment_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(Date, nullable=False)
    max_points = Column(Integer, nullable=False, default=100)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    course_offering = relationship("CourseOffering", back_populates="assignments")
    files = relationship("AssignmentFile", back_populates="assignment", cascade="all, delete-orphan")
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Assignment(assignment_id={self.assignment_id}, title='{self.title}')>"