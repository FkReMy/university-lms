"""
Professor Model (Production)
----------------------------
Represents a professor (instructor) assigned to a course offering.

- No sample/demo/test logic or fields.
- Linked to global user, department, and course offering models.
- Fully unified audit and relationship fields.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, String
from sqlalchemy.orm import relationship

from app.models.base import Base

class Professor(Base):
    """
    Database model for professors (instructors) teaching a specific course offering.
    """
    __tablename__ = "professors"

    professor_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.dept_id", ondelete="SET NULL"), nullable=True, index=True)
    role = Column(String(32), nullable=False, default="professor")  # e.g., 'lecturer', 'professor', 'coordinator'

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="professor_roles")
    course_offering = relationship("CourseOffering", back_populates="professors")
    department = relationship("Department")

    def __repr__(self):
        return (
            f"<Professor(professor_id={self.professor_id}, user_id={self.user_id}, course_offering_id={self.course_offering_id})>"
        )