"""
QuizAnswer Repository (Production)
----------------------------------
Handles all CRUD and query operations for quiz answer submissions (student responses).

- No sample, demo, or test code.
- All DB access patterns are unified, utilizing global SQLAlchemy models and session.
"""

from sqlalchemy.orm import Session
from app.models.quiz_answer import QuizAnswer

class QuizAnswerRepository:
    """
    Repository for QuizAnswer operations: create, list, update, delete, query by quiz/attempt/student.
    """

    @staticmethod
    def create(db: Session, attempt_id: int, question_id: int, selected_option_id: int, answer_text: str = None, is_correct: bool = None, points_awarded: float = None):
        """
        Creates a new quiz answer record for a student's quiz attempt.
        """
        answer = QuizAnswer(
            attempt_id=attempt_id,
            question_id=question_id,
            selected_option_id=selected_option_id,
            answer_text=answer_text,
            is_correct=is_correct,
            points_awarded=points_awarded,
        )
        db.add(answer)
        db.commit()
        db.refresh(answer)
        return answer

    @staticmethod
    def get_by_id(db: Session, answer_id: int):
        """
        Retrieve a quiz answer by its primary key.
        """
        return db.query(QuizAnswer).filter(QuizAnswer.answer_id == answer_id).first()

    @staticmethod
    def list_by_attempt(db: Session, attempt_id: int):
        """
        List all answers for a specific quiz attempt.
        """
        return db.query(QuizAnswer).filter(QuizAnswer.attempt_id == attempt_id).all()

    @staticmethod
    def list_by_question(db: Session, question_id: int):
        """
        List all quiz answers for a specific question.
        """
        return db.query(QuizAnswer).filter(QuizAnswer.question_id == question_id).all()

    @staticmethod
    def update(db: Session, answer_id: int, **kwargs):
        """
        Update the provided fields of a quiz answer record.
        """
        answer = db.query(QuizAnswer).filter(QuizAnswer.answer_id == answer_id).first()
        if not answer:
            return None
        for key, value in kwargs.items():
            setattr(answer, key, value)
        db.commit()
        db.refresh(answer)
        return answer

    @staticmethod
    def delete(db: Session, answer_id: int):
        """
        Delete a quiz answer record by primary key.
        """
        answer = db.query(QuizAnswer).filter(QuizAnswer.answer_id == answer_id).first()
        if not answer:
            return False
        db.delete(answer)
        db.commit()
        return True