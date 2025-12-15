"""
QuestionOption Model (Production)
---------------------------------
Represents a selectable option for a quiz or exam question.

- No sample/demo/test fields or logic.
- Linked to global Question.
- Unified with audit fields.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func, Boolean
from sqlalchemy.orm import relationship

from app.models.base import Base

class QuestionOption(Base):
    """
    Database model for selectable answer options for a specific question (MCQ, etc).
    """
    __tablename__ = "question_options"

    option_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.question_id", ondelete="CASCADE"), nullable=False, index=True)
    text = Column(String(512), nullable=False)
    is_correct = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    question = relationship("Question", back_populates="options")

    def __repr__(self):
        return (
            f"<QuestionOption(option_id={self.option_id}, question_id={self.question_id}, is_correct={self.is_correct})>"
        )