"""
Quiz Repository (Production)
----------------------------
Handles CRUD and business logic queries for Quiz model (assignments, tests, etc.).

- No sample, demo, or test code.
- All actions use global SQLAlchemy session and global model patterns for system unification.
"""

from sqlalchemy.orm import Session
from app.models.quiz import Quiz

class QuizRepository:
    """
    Repository for CRUD and unified business queries on Quiz entities.
    """

    @staticmethod
    def create(db: Session, course_offering_id: int, title: str, description: str = None, total_points: float = 100.0, start_time=None, end_time=None, status: str = "active"):
        """
        Create and persist a new quiz entity.
        """
        quiz = Quiz(
            course_offering_id=course_offering_id,
            title=title,
            description=description,
            total_points=total_points,
            start_time=start_time,
            end_time=end_time,
            status=status,
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        return quiz

    @staticmethod
    def get_by_id(db: Session, quiz_id: int):
        """
        Retrieve quiz by primary key.
        """
        return db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()

    @staticmethod
    def list_by_course_offering(db: Session, course_offering_id: int):
        """
        List all quizzes for the given course offering.
        """
        return db.query(Quiz).filter(Quiz.course_offering_id == course_offering_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all quizzes.
        """
        return db.query(Quiz).all()

    @staticmethod
    def update(db: Session, quiz_id: int, **kwargs):
        """
        Update quiz with provided fields.
        """
        quiz = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()
        if not quiz:
            return None
        for key, value in kwargs.items():
            setattr(quiz, key, value)
        db.commit()
        db.refresh(quiz)
        return quiz

    @staticmethod
    def delete(db: Session, quiz_id: int):
        """
        Delete a quiz by its primary key.
        """
        quiz = db.query(Quiz).filter(Quiz.quiz_id == quiz_id).first()
        if not quiz:
            return False
        db.delete(quiz)
        db.commit()
        return True