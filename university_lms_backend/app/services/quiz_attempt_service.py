"""
QuizAttempt Service (Production)
--------------------------------
Service layer for managing QuizAttempt entities, providing
CRUD operations and business logic for quiz attempts in the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and system conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.quiz_attempt import QuizAttempt
from app.schemas.quiz_attempt import (
    QuizAttemptCreate,
    QuizAttemptUpdate,
)
from app.schemas.quiz_attempt import QuizAttempt as QuizAttemptSchema

class QuizAttemptService:
    """
    Handles CRUD and business logic for quiz attempt records.
    """

    @staticmethod
    def get_by_id(db: Session, quiz_attempt_id: int) -> Optional[QuizAttemptSchema]:
        """
        Retrieve a quiz attempt by its unique identifier.
        """
        attempt_obj = db.query(QuizAttempt).filter(QuizAttempt.quiz_attempt_id == quiz_attempt_id).first()
        return QuizAttemptSchema.from_orm(attempt_obj) if attempt_obj else None

    @staticmethod
    def get_by_quiz_id(db: Session, quiz_id: int) -> List[QuizAttemptSchema]:
        """
        Retrieve all quiz attempts for a given quiz.
        """
        attempts = db.query(QuizAttempt).filter(QuizAttempt.quiz_id == quiz_id).all()
        return [QuizAttemptSchema.from_orm(a) for a in attempts]

    @staticmethod
    def get_by_student_id(db: Session, student_id: int) -> List[QuizAttemptSchema]:
        """
        Retrieve all quiz attempts by a given student.
        """
        attempts = db.query(QuizAttempt).filter(QuizAttempt.student_id == student_id).all()
        return [QuizAttemptSchema.from_orm(a) for a in attempts]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[QuizAttemptSchema]:
        """
        Retrieve a paginated list of all quiz attempts.
        """
        attempts = db.query(QuizAttempt).offset(skip).limit(limit).all()
        return [QuizAttemptSchema.from_orm(a) for a in attempts]

    @staticmethod
    def create(db: Session, attempt_in: QuizAttemptCreate) -> QuizAttemptSchema:
        """
        Create and persist a new quiz attempt record.
        """
        attempt_obj = QuizAttempt(**attempt_in.dict())
        db.add(attempt_obj)
        db.commit()
        db.refresh(attempt_obj)
        return QuizAttemptSchema.from_orm(attempt_obj)

    @staticmethod
    def update(
        db: Session,
        quiz_attempt_id: int,
        attempt_in: QuizAttemptUpdate
    ) -> Optional[QuizAttemptSchema]:
        """
        Update an existing quiz attempt with new values.
        """
        attempt_obj = db.query(QuizAttempt).filter(QuizAttempt.quiz_attempt_id == quiz_attempt_id).first()
        if not attempt_obj:
            return None
        for field, value in attempt_in.dict(exclude_unset=True).items():
            setattr(attempt_obj, field, value)
        db.commit()
        db.refresh(attempt_obj)
        return QuizAttemptSchema.from_orm(attempt_obj)

    @staticmethod
    def delete(db: Session, quiz_attempt_id: int) -> bool:
        """
        Delete a quiz attempt by its ID. Returns True if deleted, False if not found.
        """
        attempt_obj = db.query(QuizAttempt).filter(QuizAttempt.quiz_attempt_id == quiz_attempt_id).first()
        if not attempt_obj:
            return False
        db.delete(attempt_obj)
        db.commit()
        return True