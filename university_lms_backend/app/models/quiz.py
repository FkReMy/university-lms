"""
Quiz Model (Production)
-----------------------
Represents a quiz or exam in the University LMS.

- No sample/demo/test fields.
- Fully unified with course offerings, assignments, and quiz/question/attempt relationships.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime, Date, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Quiz(Base):
    """
    Database model for a quiz or exam, associated with a course offering and optionally an assignment.
    """
    __tablename__ = "quizzes"

    quiz_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    course_offering_id = Column(Integer, ForeignKey("course_offerings.offering_id", ondelete="CASCADE"), nullable=False, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.assignment_id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    duration_minutes = Column(Integer, nullable=True, doc="Allowed duration for the quiz in minutes")
    total_points = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    course_offering = relationship("CourseOffering")
    assignment = relationship("Assignment")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")
    files = relationship("QuizFile", back_populates="quiz", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Quiz(quiz_id={self.quiz_id}, title='{self.title}')>"