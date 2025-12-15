"""
Quiz Service (Production)
-------------------------
Service layer for managing Quiz entities, providing CRUD operations and business logic for quizzes within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.quiz import Quiz
from app.schemas.quiz import (
    QuizCreate,
    QuizUpdate,
)
from app.schemas.quiz import Quiz as QuizSchema

class QuizService:
    """
    Handles CRUD and business logic for quiz records.
    """

    @staticmethod
    def get_by_id(db: Session, quiz_id: int) -> Optional[QuizSchema]:
        """
        Retrieve a quiz by its unique identifier.
        """
        quiz_obj = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()
        return QuizSchema.from_orm(quiz_obj) if quiz_obj else None

    @staticmethod
    def get_by_course_offering_id(db: Session, course_offering_id: int) -> List[QuizSchema]:
        """
        Retrieve all quizzes associated with a specific course offering.
        """
        quizzes = db.query(Quiz).filter(Quiz.course_offering_id == course_offering_id).all()
        return [QuizSchema.from_orm(q) for q in quizzes]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[QuizSchema]:
        """
        Retrieve a paginated list of all quizzes.
        """
        quizzes = db.query(Quiz).offset(skip).limit(limit).all()
        return [QuizSchema.from_orm(q) for q in quizzes]

    @staticmethod
    def create(db: Session, quiz_in: QuizCreate) -> QuizSchema:
        """
        Create and persist a new quiz record.
        """
        quiz_obj = Quiz(**quiz_in.dict())
        db.add(quiz_obj)
        db.commit()
        db.refresh(quiz_obj)
        return QuizSchema.from_orm(quiz_obj)

    @staticmethod
    def update(
        db: Session,
        quiz_id: int,
        quiz_in: QuizUpdate
    ) -> Optional[QuizSchema]:
        """
        Update an existing quiz with provided fields.
        """
        quiz_obj = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()
        if not quiz_obj:
            return None
        for field, value in quiz_in.dict(exclude_unset=True).items():
            setattr(quiz_obj, field, value)
        db.commit()
        db.refresh(quiz_obj)
        return QuizSchema.from_orm(quiz_obj)

    @staticmethod
    def delete(db: Session, quiz_id: int) -> bool:
        """
        Delete a quiz by its ID. Returns True if deleted, False if not found.
        """
        quiz_obj = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()
        if not quiz_obj:
            return False
        db.delete(quiz_obj)
        db.commit()
        return True