"""
Grade Model (Production)
------------------------
Represents a grade/score record for a student's work (assignment, quiz, course, etc).

- No sample/demo/test logic or fields.
- Fully unified for global reporting and staff/student access.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Float, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Grade(Base):
    """
    Database model for grades/marks for students' coursework (assignment, quiz, or course grade).
    """
    __tablename__ = "grades"

    grade_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.assignment_id", ondelete="SET NULL"), nullable=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.quiz_id", ondelete="SET NULL"), nullable=True, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="SET NULL"), nullable=True, index=True)

    grade_value = Column(String(16), nullable=False)  # E.g., "A", "B+", "89.5", etc.
    numeric_score = Column(Float, nullable=True)
    remarks = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    student = relationship("User", back_populates="grades")
    assignment = relationship("Assignment")
    quiz = relationship("Quiz")
    course_offering = relationship("CourseOffering")

    def __repr__(self):
        return (
            f"<Grade(grade_id={self.grade_id}, student_id={self.student_id}, value={self.grade_value})>"
        )