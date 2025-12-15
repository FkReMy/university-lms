"""
QuestionOption Repository (Production)
--------------------------------------
Handles database operations for QuestionOption model (used for MCQ, exams/quizzes/question banks).

- No sample, demo, or test code.
- Fully uses global SQLAlchemy models and session pattern across the LMS.
"""

from sqlalchemy.orm import Session
from app.models.question_option import QuestionOption

class QuestionOptionRepository:
    """
    Repository for CRUD and query operations on QuestionOption model.
    """

    @staticmethod
    def create(db: Session, question_id: int, option_text: str, is_correct: bool = False):
        """
        Create a new option for a question.
        """
        option = QuestionOption(
            question_id=question_id,
            option_text=option_text,
            is_correct=is_correct
        )
        db.add(option)
        db.commit()
        db.refresh(option)
        return option

    @staticmethod
    def get_by_id(db: Session, option_id: int):
        """
        Retrieve a question option by its primary key.
        """
        return db.query(QuestionOption).filter(QuestionOption.option_id == option_id).first()

    @staticmethod
    def list_by_question(db: Session, question_id: int):
        """
        List all options belonging to a particular question.
        """
        return db.query(QuestionOption).filter(QuestionOption.question_id == question_id).all()

    @staticmethod
    def update(db: Session, option_id: int, **kwargs):
        """
        Update a question option with new values.
        """
        option = db.query(QuestionOption).filter(QuestionOption.option_id == option_id).first()
        if not option:
            return None
        for key, value in kwargs.items():
            setattr(option, key, value)
        db.commit()
        db.refresh(option)
        return option

    @staticmethod
    def delete(db: Session, option_id: int):
        """
        Delete a question option by its primary key.
        """
        option = db.query(QuestionOption).filter(QuestionOption.option_id == option_id).first()
        if not option:
            return False
        db.delete(option)
        db.commit()
        return True