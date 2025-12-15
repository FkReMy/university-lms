"""
Question Repository (Production)
--------------------------------
Handles all CRUD and business logic for the Question model (quizzes, exams, banks).

- No sample, demo, or test code.
- Fully unified via global SQLAlchemy session and model pattern.
"""

from sqlalchemy.orm import Session
from app.models.question import Question

class QuestionRepository:
    """
    Repository for CRUD/query operations for Question model.
    """

    @staticmethod
    def create(db: Session, text: str, question_type: str, creator_id: int, points: float = 1.0, explanation: str = None):
        """
        Create and persist a new Question in the database.
        """
        question = Question(
            text=text,
            question_type=question_type,
            creator_id=creator_id,
            points=points,
            explanation=explanation,
        )
        db.add(question)
        db.commit()
        db.refresh(question)
        return question

    @staticmethod
    def get_by_id(db: Session, question_id: int):
        """
        Retrieve a question by its primary key.
        """
        return db.query(Question).filter(Question.question_id == question_id).first()

    @staticmethod
    def list_by_creator(db: Session, creator_id: int):
        """
        List all questions created by a specific user.
        """
        return db.query(Question).filter(Question.creator_id == creator_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all questions in the system.
        """
        return db.query(Question).all()

    @staticmethod
    def update(db: Session, question_id: int, **kwargs):
        """
        Update question fields with provided values.
        """
        question = db.query(Question).filter(Question.question_id == question_id).first()
        if not question:
            return None
        for key, value in kwargs.items():
            setattr(question, key, value)
        db.commit()
        db.refresh(question)
        return question

    @staticmethod
    def delete(db: Session, question_id: int):
        """
        Delete a question by primary key.
        """
        question = db.query(Question).filter(Question.question_id == question_id).first()
        if not question:
            return False
        db.delete(question)
        db.commit()
        return True