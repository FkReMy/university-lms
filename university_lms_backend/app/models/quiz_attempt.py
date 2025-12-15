"""
QuizAttempt Model (Production)
------------------------------
Represents a single user's attempt to complete a quiz.

- No sample/demo/test logic or fields.
- Fully unified with global user, quiz and quiz answer models.
- Used for time tracking, scoring, and anti-cheating enforcement.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Float, Boolean
from sqlalchemy.orm import relationship

from app.models.base import Base

class QuizAttempt(Base):
    """
    Database model for user's attempt at a given quiz.
    Records score, timing, and links to each answer row.
    """
    __tablename__ = "quiz_attempts"

    attempt_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.quiz_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)

    started_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    total_score = Column(Float, nullable=True)
    is_submitted = Column(Boolean, nullable=False, default=False)
    is_graded = Column(Boolean, nullable=False, default=False)

    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")
    student = relationship("User")
    answers = relationship("QuizAnswer", back_populates="attempt", cascade="all, delete-orphan")

    def __repr__(self):
        return (
            f"<QuizAttempt(attempt_id={self.attempt_id}, quiz_id={self.quiz_id}, student_id={self.student_id}, total_score={self.total_score})>"
        )