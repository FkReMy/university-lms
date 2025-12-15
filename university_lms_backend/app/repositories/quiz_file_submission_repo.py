"""
QuizFileSubmission Repository (Production)
------------------------------------------
Handles database operations for quiz file submissions (student assignment uploads for quizzes).

- No sample, demo, or test code.
- Unified global SQLAlchemy components and models are used.
"""

from sqlalchemy.orm import Session
from app.models.quiz_file_submission import QuizFileSubmission

class QuizFileSubmissionRepository:
    """
    Repository for CRUD and business logic for QuizFileSubmission model.
    """

    @staticmethod
    def create(db: Session, attempt_id: int, file_path: str, uploaded_by_id: int, filename: str, description: str = None):
        """
        Create a new quiz file submission.
        """
        submission = QuizFileSubmission(
            attempt_id=attempt_id,
            file_path=file_path,
            uploaded_by_id=uploaded_by_id,
            filename=filename,
            description=description,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        return submission

    @staticmethod
    def get_by_id(db: Session, quiz_file_submission_id: int):
        """
        Retrieve a quiz file submission by primary key.
        """
        return db.query(QuizFileSubmission).filter(QuizFileSubmission.quiz_file_submission_id == quiz_file_submission_id).first()

    @staticmethod
    def list_by_attempt(db: Session, attempt_id: int):
        """
        List all file submissions for a specific quiz attempt.
        """
        return db.query(QuizFileSubmission).filter(QuizFileSubmission.attempt_id == attempt_id).all()

    @staticmethod
    def update(db: Session, quiz_file_submission_id: int, **kwargs):
        """
        Update the attributes of a quiz file submission record.
        """
        submission = db.query(QuizFileSubmission).filter(QuizFileSubmission.quiz_file_submission_id == quiz_file_submission_id).first()
        if not submission:
            return None
        for key, value in kwargs.items():
            setattr(submission, key, value)
        db.commit()
        db.refresh(submission)
        return submission

    @staticmethod
    def delete(db: Session, quiz_file_submission_id: int):
        """
        Delete a quiz file submission by its primary key.
        """
        submission = db.query(QuizFileSubmission).filter(QuizFileSubmission.quiz_file_submission_id == quiz_file_submission_id).first()
        if not submission:
            return False
        db.delete(submission)
        db.commit()
        return True