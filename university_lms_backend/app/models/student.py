"""
Student Model (Production)
--------------------------
Represents a student user entity in the University LMS.

- No sample, demo, or test fields.
- Fully unified with global user, enrollment, and specialization models.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, String
from sqlalchemy.orm import relationship

from app.models.base import Base

class Student(Base):
    """
    Database model for a student, mapped to a user profile.
    Handles academic metadata (specialization, enrollments).
    """
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    specialization_id = Column(Integer, ForeignKey("specializations.specialization_id", ondelete="SET NULL"), nullable=True, index=True)
    year = Column(Integer, nullable=False, doc="Academic year of the student, e.g., 1, 2, 3, 4")
    status = Column(String(32), nullable=False, default="active", doc="e.g., 'active', 'graduated', 'inactive'")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="student_profile", lazy='select')
    specialization = relationship("Specialization", lazy='select')
    # Note: enrollments are accessed through user.enrollments since Enrollment.student_id points to users.user_id

    def __repr__(self):
        return (
            f"<Student(student_id={self.student_id}, user_id={self.user_id}, status='{self.status}', year={self.year})>"
        )