"""
QuizAnswer Service (Production)
-------------------------------
Service layer for managing QuizAnswer entities, providing
CRUD operations and business logic for quiz answers in the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.quiz_answer import QuizAnswer
from app.schemas.quiz_answer import (
    QuizAnswerCreate,
    QuizAnswerUpdate,
)
from app.schemas.quiz_answer import QuizAnswer as QuizAnswerSchema

class QuizAnswerService:
    """
    Handles CRUD and business logic for quiz answers.
    """

    @staticmethod
    def get_by_id(db: Session, quiz_answer_id: int) -> Optional[QuizAnswerSchema]:
        """
        Retrieve a quiz answer by its unique identifier.
        """
        answer_obj = db.query(QuizAnswer).filter(QuizAnswer.quiz_answer_id == quiz_answer_id).first()
        return QuizAnswerSchema.from_orm(answer_obj) if answer_obj else None

    @staticmethod
    def get_by_quiz_submission_id(db: Session, quiz_submission_id: int) -> List[QuizAnswerSchema]:
        """
        Retrieve all quiz answers for a given quiz submission.
        """
        answers = db.query(QuizAnswer).filter(QuizAnswer.quiz_submission_id == quiz_submission_id).all()
        return [QuizAnswerSchema.from_orm(a) for a in answers]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[QuizAnswerSchema]:
        """
        Retrieve a paginated list of all quiz answers.
        """
        answers = db.query(QuizAnswer).offset(skip).limit(limit).all()
        return [QuizAnswerSchema.from_orm(a) for a in answers]

    @staticmethod
    def create(db: Session, answer_in: QuizAnswerCreate) -> QuizAnswerSchema:
        """
        Create and persist a new quiz answer record.
        """
        answer_obj = QuizAnswer(**answer_in.dict())
        db.add(answer_obj)
        db.commit()
        db.refresh(answer_obj)
        return QuizAnswerSchema.from_orm(answer_obj)

    @staticmethod
    def update(
        db: Session,
        quiz_answer_id: int,
        answer_in: QuizAnswerUpdate
    ) -> Optional[QuizAnswerSchema]:
        """
        Update an existing quiz answer with new values.
        """
        answer_obj = db.query(QuizAnswer).filter(QuizAnswer.quiz_answer_id == quiz_answer_id).first()
        if not answer_obj:
            return None
        for field, value in answer_in.dict(exclude_unset=True).items():
            setattr(answer_obj, field, value)
        db.commit()
        db.refresh(answer_obj)
        return QuizAnswerSchema.from_orm(answer_obj)

    @staticmethod
    def delete(db: Session, quiz_answer_id: int) -> bool:
        """
        Delete a quiz answer by its ID. Returns True if deleted, False if not found.
        """
        answer_obj = db.query(QuizAnswer).filter(QuizAnswer.quiz_answer_id == quiz_answer_id).first()
        if not answer_obj:
            return False
        db.delete(answer_obj)
        db.commit()
        return True