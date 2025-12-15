"""
Question Service (Production)
-----------------------------
Service layer for managing Question entities, providing
CRUD operations and business logic for questions within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and project-wide conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.question import Question
from app.schemas.question import (
    QuestionCreate,
    QuestionUpdate,
)
from app.schemas.question import Question as QuestionSchema

class QuestionService:
    """
    Handles CRUD and business operations for questions.
    """

    @staticmethod
    def get_by_id(db: Session, question_id: int) -> Optional[QuestionSchema]:
        """
        Retrieve a question by its unique identifier.
        """
        question_obj = db.query(Question).filter(Question.question_id == question_id).first()
        return QuestionSchema.from_orm(question_obj) if question_obj else None

    @staticmethod
    def get_by_assignment_id(db: Session, assignment_id: int) -> List[QuestionSchema]:
        """
        Retrieve all questions for a specific assignment.
        """
        questions = db.query(Question).filter(Question.assignment_id == assignment_id).all()
        return [QuestionSchema.from_orm(q) for q in questions]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[QuestionSchema]:
        """
        Retrieve a paginated list of all questions.
        """
        questions = db.query(Question).offset(skip).limit(limit).all()
        return [QuestionSchema.from_orm(q) for q in questions]

    @staticmethod
    def create(db: Session, question_in: QuestionCreate) -> QuestionSchema:
        """
        Create and persist a new question.
        """
        question_obj = Question(**question_in.dict())
        db.add(question_obj)
        db.commit()
        db.refresh(question_obj)
        return QuestionSchema.from_orm(question_obj)

    @staticmethod
    def update(
        db: Session,
        question_id: int,
        question_in: QuestionUpdate
    ) -> Optional[QuestionSchema]:
        """
        Update an existing question with new values.
        """
        question_obj = db.query(Question).filter(Question.question_id == question_id).first()
        if not question_obj:
            return None
        for field, value in question_in.dict(exclude_unset=True).items():
            setattr(question_obj, field, value)
        db.commit()
        db.refresh(question_obj)
        return QuestionSchema.from_orm(question_obj)

    @staticmethod
    def delete(db: Session, question_id: int) -> bool:
        """
        Delete a question by its ID. Returns True if deleted, False if not found.
        """
        question_obj = db.query(Question).filter(Question.question_id == question_id).first()
        if not question_obj:
            return False
        db.delete(question_obj)
        db.commit()
        return True