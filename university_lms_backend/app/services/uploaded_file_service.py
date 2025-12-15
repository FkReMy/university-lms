"""
UploadedFile Service (Production)
---------------------------------
Service layer for managing UploadedFile entities, encapsulating CRUD operations
and business logic for files uploaded to the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.uploaded_file import UploadedFile
from app.schemas.uploaded_file import (
    UploadedFileCreate,
    UploadedFileUpdate,
)
from app.schemas.uploaded_file import UploadedFile as UploadedFileSchema

class UploadedFileService:
    """
    Handles CRUD and business logic for uploaded file records.
    """

    @staticmethod
    def get_by_id(db: Session, uploaded_file_id: int) -> Optional[UploadedFileSchema]:
        """
        Retrieve an uploaded file by its unique identifier.
        """
        file_obj = db.query(UploadedFile).filter(UploadedFile.uploaded_file_id == uploaded_file_id).first()
        return UploadedFileSchema.from_orm(file_obj) if file_obj else None

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> List[UploadedFileSchema]:
        """
        Retrieve all files uploaded by a specific user.
        """
        files = db.query(UploadedFile).filter(UploadedFile.user_id == user_id).all()
        return [UploadedFileSchema.from_orm(f) for f in files]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[UploadedFileSchema]:
        """
        Retrieve a paginated list of all uploaded files.
        """
        files = db.query(UploadedFile).offset(skip).limit(limit).all()
        return [UploadedFileSchema.from_orm(f) for f in files]

    @staticmethod
    def create(db: Session, file_in: UploadedFileCreate) -> UploadedFileSchema:
        """
        Create and persist a new uploaded file record.
        """
        file_obj = UploadedFile(**file_in.dict())
        db.add(file_obj)
        db.commit()
        db.refresh(file_obj)
        return UploadedFileSchema.from_orm(file_obj)

    @staticmethod
    def update(
        db: Session,
        uploaded_file_id: int,
        file_in: UploadedFileUpdate
    ) -> Optional[UploadedFileSchema]:
        """
        Update an existing uploaded file record with provided fields.
        """
        file_obj = db.query(UploadedFile).filter(UploadedFile.uploaded_file_id == uploaded_file_id).first()
        if not file_obj:
            return None
        for field, value in file_in.dict(exclude_unset=True).items():
            setattr(file_obj, field, value)
        db.commit()
        db.refresh(file_obj)
        return UploadedFileSchema.from_orm(file_obj)

    @staticmethod
    def delete(db: Session, uploaded_file_id: int) -> bool:
        """
        Delete an uploaded file by its ID. Returns True if deleted, False if not found.
        """
        file_obj = db.query(UploadedFile).filter(UploadedFile.uploaded_file_id == uploaded_file_id).first()
        if not file_obj:
            return False
        db.delete(file_obj)
        db.commit()
        return True