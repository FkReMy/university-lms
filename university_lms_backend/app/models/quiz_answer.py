"""
QuizAnswer Model (Production)
-----------------------------
Represents an individual user's answer to a quiz question (one row per question/attempt/user).

- No sample/demo/test logic or fields.
- Unified with global user, quiz, attempt and question models.
- Used for scoring and grading flows.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, String, Boolean, Text
from sqlalchemy.orm import relationship

from app.models.base import Base

class QuizAnswer(Base):
    """
    Database model for a student's answer to a specific quiz question in a quiz attempt.
    """
    __tablename__ = "quiz_answers"

    answer_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.attempt_id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # The actual answer text or selected option value
    answer_text = Column(Text, nullable=True)
    selected_option_id = Column(Integer, ForeignKey("question_options.option_id", ondelete="SET NULL"), nullable=True)
    
    is_correct = Column(Boolean, nullable=True, doc="Flag if answer is correct (computed on grading)")
    score_awarded = Column(Integer, nullable=True, doc="Score awarded for this answer")
    feedback = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("Question")
    student = relationship("User")
    selected_option = relationship("QuestionOption")

    def __repr__(self):
        return (
            f"<QuizAnswer(answer_id={self.answer_id}, question_id={self.question_id}, student_id={self.student_id})>"
        )