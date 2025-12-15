"""
QuestionOption Service (Production)
-----------------------------------
Service layer for managing QuestionOption entities, providing
CRUD operations and business logic for question options within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and system-wide conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.question_option import QuestionOption
from app.schemas.question_option import (
    QuestionOptionCreate,
    QuestionOptionUpdate,
)
from app.schemas.question_option import QuestionOption as QuestionOptionSchema

class QuestionOptionService:
    """
    Handles CRUD and business operations for question options.
    """

    @staticmethod
    def get_by_id(db: Session, question_option_id: int) -> Optional[QuestionOptionSchema]:
        """
        Retrieve a question option by its unique identifier.
        """
        option_obj = db.query(QuestionOption).filter(QuestionOption.question_option_id == question_option_id).first()
        return QuestionOptionSchema.from_orm(option_obj) if option_obj else None

    @staticmethod
    def get_by_question_id(db: Session, question_id: int) -> List[QuestionOptionSchema]:
        """
        Retrieve all options for a specific question.
        """
        options = db.query(QuestionOption).filter(QuestionOption.question_id == question_id).all()
        return [QuestionOptionSchema.from_orm(o) for o in options]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[QuestionOptionSchema]:
        """
        Retrieve a paginated list of all question options.
        """
        options = db.query(QuestionOption).offset(skip).limit(limit).all()
        return [QuestionOptionSchema.from_orm(o) for o in options]

    @staticmethod
    def create(db: Session, option_in: QuestionOptionCreate) -> QuestionOptionSchema:
        """
        Create and persist a new question option.
        """
        option_obj = QuestionOption(**option_in.dict())
        db.add(option_obj)
        db.commit()
        db.refresh(option_obj)
        return QuestionOptionSchema.from_orm(option_obj)

    @staticmethod
    def update(
        db: Session,
        question_option_id: int,
        option_in: QuestionOptionUpdate
    ) -> Optional[QuestionOptionSchema]:
        """
        Update an existing question option with new values.
        """
        option_obj = db.query(QuestionOption).filter(QuestionOption.question_option_id == question_option_id).first()
        if not option_obj:
            return None
        for field, value in option_in.dict(exclude_unset=True).items():
            setattr(option_obj, field, value)
        db.commit()
        db.refresh(option_obj)
        return QuestionOptionSchema.from_orm(option_obj)

    @staticmethod
    def delete(db: Session, question_option_id: int) -> bool:
        """
        Delete a question option by its ID. Returns True if deleted, False if not found.
        """
        option_obj = db.query(QuestionOption).filter(QuestionOption.question_option_id == question_option_id).first()
        if not option_obj:
            return False
        db.delete(option_obj)
        db.commit()
        return True