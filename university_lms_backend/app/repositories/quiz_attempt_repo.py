"""
QuizAttempt Repository (Production)
-----------------------------------
Implements CRUD operations and business queries for quiz attempts (individual student attempts at a quiz).

- No sample, demo, or test code.
- Only global SQLAlchemy models and session patterns used throughout.
"""

from sqlalchemy.orm import Session
from app.models.quiz_attempt import QuizAttempt

class QuizAttemptRepository:
    """
    Repository for QuizAttempt operations for production (create, list, update, delete, and specific queries).
    """

    @staticmethod
    def create(db: Session, quiz_id: int, student_id: int, started_at=None, completed_at=None, total_score: float = None, status: str = "in-progress"):
        """
        Insert a new quiz attempt record.
        """
        attempt = QuizAttempt(
            quiz_id=quiz_id,
            student_id=student_id,
            started_at=started_at,
            completed_at=completed_at,
            total_score=total_score,
            status=status,
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        return attempt

    @staticmethod
    def get_by_id(db: Session, attempt_id: int):
        """
        Retrieve a quiz attempt by its ID (primary key).
        """
        return db.query(QuizAttempt).filter(QuizAttempt.attempt_id == attempt_id).first()

    @staticmethod
    def list_by_quiz(db: Session, quiz_id: int):
        """
        List all quiz attempts for a specified quiz.
        """
        return db.query(QuizAttempt).filter(QuizAttempt.quiz_id == quiz_id).all()

    @staticmethod
    def list_by_student(db: Session, student_id: int):
        """
        List all quiz attempts by a specific student.
        """
        return db.query(QuizAttempt).filter(QuizAttempt.student_id == student_id).all()

    @staticmethod
    def update(db: Session, attempt_id: int, **kwargs):
        """
        Update the provided fields for a quiz attempt.
        """
        attempt = db.query(QuizAttempt).filter(QuizAttempt.attempt_id == attempt_id).first()
        if not attempt:
            return None
        for key, value in kwargs.items():
            setattr(attempt, key, value)
        db.commit()
        db.refresh(attempt)
        return attempt

    @staticmethod
    def delete(db: Session, attempt_id: int):
        """
        Delete a quiz attempt by its ID.
        """
        attempt = db.query(QuizAttempt).filter(QuizAttempt.attempt_id == attempt_id).first()
        if not attempt:
            return False
        db.delete(attempt)
        db.commit()
        return True