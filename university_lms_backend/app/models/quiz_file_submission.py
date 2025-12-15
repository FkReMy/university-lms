"""
QuizFileSubmission Model (Production)
-------------------------------------
Represents a file uploaded as part of a quiz attempt, e.g., for essay/image responses.

- No sample, demo, or test fields.
- Unified with global user, quiz attempt, and storage components.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class QuizFileSubmission(Base):
    """
    Database model for files submitted as part of a quiz attempt (e.g., essay, diagram upload).
    """
    __tablename__ = "quiz_file_submissions"

    file_submission_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.attempt_id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)

    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False, doc="Cloud/local storage path or URL")
    content_type = Column(String(128), nullable=False)

    uploaded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    attempt = relationship("QuizAttempt")
    question = relationship("Question")
    student = relationship("User")

    def __repr__(self):
        return (
            f"<QuizFileSubmission(file_submission_id={self.file_submission_id}, attempt_id={self.attempt_id}, question_id={self.question_id}, student_id={self.student_id})>"
        )