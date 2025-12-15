"""
Enrollment Model (Production)
-----------------------------
Represents a student's enrollment in a particular course offering.

- No sample, demo, or test fields; only true production logic.
- Unified with global user/course/session/section structures.
- Used for permission, grading, roster, and all student-course logic.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Boolean, String
from sqlalchemy.orm import relationship

from app.models.base import Base

class Enrollment(Base):
    """
    Database model linking a student (user) to a course offering (for a session).
    """
    __tablename__ = "enrollments"

    enrollment_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)
    section_group_id = Column(Integer, ForeignKey("section_groups.section_group_id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(String(32), nullable=False, default="active")  # e.g., 'active', 'dropped', 'waitlisted'
    enrolled_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    student = relationship("User", back_populates="enrollments")
    course_offering = relationship("CourseOffering", back_populates="enrollments")
    section_group = relationship("SectionGroup", back_populates="enrollments")

    def __repr__(self):
        return (
            f"<Enrollment(enrollment_id={self.enrollment_id}, student_id={self.student_id}, "
            f"course_offering_id={self.course_offering_id}, status='{self.status}')>"
        )