"""
AssociateTeacher Model (Production)
-----------------------------------
Represents teachers (typically teaching assistants) assigned to support
course offerings within the University LMS.

- No demo, sample or test fields.
- Linked to real user and course offering models.
- Unified with global audit and relationship structures.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, String
from sqlalchemy.orm import relationship

from app.models.base import Base

class AssociateTeacher(Base):
    """
    Database model for associate teachers (e.g., teaching assistants).
    Each is tied to a user and a specific course offering.
    """
    __tablename__ = "associate_teachers"

    assoc_teacher_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(32), nullable=False, default="associate_teacher")  # e.g., 'TA', 'grader', etc.
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="associate_teacher_roles")
    course_offering = relationship("CourseOffering", back_populates="associate_teachers")

    def __repr__(self):
        return f"<AssociateTeacher(assoc_teacher_id={self.assoc_teacher_id}, user_id={self.user_id}, course_offering_id={self.course_offering_id})>"
    