"""
QuizFile Service (Production)
-----------------------------
Service layer for managing QuizFile entities, providing
CRUD operations and business logic for quiz files within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and system-wide conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.quiz_file import QuizFile
from app.schemas.quiz_file import (
    QuizFileCreate,
    QuizFileUpdate,
)
from app.schemas.quiz_file import QuizFile as QuizFileSchema

class QuizFileService:
    """
    Handles CRUD and business logic for quiz file records.
    """

    @staticmethod
    def get_by_id(db: Session, quiz_file_id: int) -> Optional[QuizFileSchema]:
        """
        Retrieve a quiz file by its unique identifier.
        """
        file_obj = db.query(QuizFile).filter(QuizFile.quiz_file_id == quiz_file_id).first()
        return QuizFileSchema.from_orm(file_obj) if file_obj else None

    @staticmethod
    def get_by_quiz_id(db: Session, quiz_id: int) -> List[QuizFileSchema]:
        """
        Retrieve all quiz files attached to a specific quiz.
        """
        files = db.query(QuizFile).filter(QuizFile.quiz_id == quiz_id).all()
        return [QuizFileSchema.from_orm(f) for f in files]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[QuizFileSchema]:
        """
        Retrieve a paginated list of all quiz files.
        """
        files = db.query(QuizFile).offset(skip).limit(limit).all()
        return [QuizFileSchema.from_orm(f) for f in files]

    @staticmethod
    def create(db: Session, file_in: QuizFileCreate) -> QuizFileSchema:
        """
        Create and persist a new quiz file record.
        """
        file_obj = QuizFile(**file_in.dict())
        db.add(file_obj)
        db.commit()
        db.refresh(file_obj)
        return QuizFileSchema.from_orm(file_obj)

    @staticmethod
    def update(
        db: Session,
        quiz_file_id: int,
        file_in: QuizFileUpdate
    ) -> Optional[QuizFileSchema]:
        """
        Update an existing quiz file with new values.
        """
        file_obj = db.query(QuizFile).filter(QuizFile.quiz_file_id == quiz_file_id).first()
        if not file_obj:
            return None
        for field, value in file_in.dict(exclude_unset=True).items():
            setattr(file_obj, field, value)
        db.commit()
        db.refresh(file_obj)
        return QuizFileSchema.from_orm(file_obj)

    @staticmethod
    def delete(db: Session, quiz_file_id: int) -> bool:
        """
        Delete a quiz file by its ID. Returns True if deleted, False if not found.
        """
        file_obj = db.query(QuizFile).filter(QuizFile.quiz_file_id == quiz_file_id).first()
        if not file_obj:
            return False
        db.delete(file_obj)
        db.commit()
        return True