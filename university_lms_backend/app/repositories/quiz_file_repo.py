"""
QuizFile Repository (Production)
-------------------------------
Handles storage and access for files attached to quizzes (e.g., resources, images).

- No sample, demo, or test code.
- Uses global SQLAlchemy session and model components.
"""

from sqlalchemy.orm import Session
from app.models.quiz_file import QuizFile

class QuizFileRepository:
    """
    Repository for CRUD and query operations on QuizFile model.
    """

    @staticmethod
    def create(db: Session, quiz_id: int, file_path: str, uploaded_by_id: int, filename: str, description: str = None):
        """
        Inserts a new file related to a quiz (e.g., images for quiz questions, attachments).
        """
        quiz_file = QuizFile(
            quiz_id=quiz_id,
            file_path=file_path,
            uploaded_by_id=uploaded_by_id,
            filename=filename,
            description=description,
        )
        db.add(quiz_file)
        db.commit()
        db.refresh(quiz_file)
        return quiz_file

    @staticmethod
    def get_by_id(db: Session, quiz_file_id: int):
        """
        Retrieve a quiz file by its primary key.
        """
        return db.query(QuizFile).filter(QuizFile.quiz_file_id == quiz_file_id).first()

    @staticmethod
    def list_by_quiz(db: Session, quiz_id: int):
        """
        List all files related to a particular quiz.
        """
        return db.query(QuizFile).filter(QuizFile.quiz_id == quiz_id).all()

    @staticmethod
    def update(db: Session, quiz_file_id: int, **kwargs):
        """
        Update fields of a quiz file (such as filename or description).
        """
        quiz_file = db.query(QuizFile).filter(QuizFile.quiz_file_id == quiz_file_id).first()
        if not quiz_file:
            return None
        for key, value in kwargs.items():
            setattr(quiz_file, key, value)
        db.commit()
        db.refresh(quiz_file)
        return quiz_file

    @staticmethod
    def delete(db: Session, quiz_file_id: int):
        """
        Permanently delete a quiz file record by primary key.
        """
        quiz_file = db.query(QuizFile).filter(QuizFile.quiz_file_id == quiz_file_id).first()
        if not quiz_file:
            return False
        db.delete(quiz_file)
        db.commit()
        return True