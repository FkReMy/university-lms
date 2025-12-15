"""
Question Model (Production)
---------------------------
Represents a quiz/exam question (supports multiple types) in the University LMS.

- No sample/demo/test logic or fields.
- Unified with quiz, assignment, audit, and options relationships.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Question(Base):
    """
    Database model for questions linked to quizzes or assignments.
    Supports various types, e.g. MCQ, short answer.
    """
    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.quiz_id", ondelete="CASCADE"), nullable=False, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.assignment_id", ondelete="SET NULL"), nullable=True, index=True)

    text = Column(Text, nullable=False)
    question_type = Column(String(32), nullable=False, doc="E.g., MCQ, short_answer, true_false, etc.")
    points = Column(Integer, nullable=False, default=1)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    assignment = relationship("Assignment")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Question(question_id={self.question_id}, question_type='{self.question_type}')>"