"""
AssignmentSubmission Model (Production)
---------------------------------------
Represents a student's submitted work (file and/or digital entry) for an assignment.

- No sample or demo data.
- Fields are unified to support typical university grading flows.
- Relationships include grade, feedback, and assignment linkage.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func, Text, Boolean
from sqlalchemy.orm import relationship

from app.models.base import Base

class AssignmentSubmission(Base):
    """
    Database model for an individual assignment submission by a student.
    Supports file and/or text submission, and staff feedback (grade, comments).
    """
    __tablename__ = "assignment_submissions"

    submission_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.assignment_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)

    # File location if uploaded as file, else null
    file_path = Column(String(512), nullable=True)
    file_name = Column(String(255), nullable=True)
    content_type = Column(String(128), nullable=True)

    # Optional digital/text submission content
    digital_content = Column(Text, nullable=True)

    # Staff feedback/grade fields
    feedback = Column(Text, nullable=True)
    graded_by_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    grade = Column(String(16), nullable=True)  # E.g., letter grade, percent

    is_final = Column(Boolean, nullable=False, default=True, doc="Is this the final submission for the student")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", foreign_keys=[student_id], back_populates="assignment_submissions")
    graded_by = relationship("User", foreign_keys=[graded_by_id])

    def __repr__(self):
        return f"<AssignmentSubmission(submission_id={self.submission_id}, student_id={self.student_id}, assignment_id={self.assignment_id})>"