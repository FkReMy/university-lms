"""
UploadedFile Repository (Production)
------------------------------------
Handles CRUD and business logic for files uploaded by users (course materials, assignments, profile pictures, etc.).

- No sample, demo, or test code.
- Uses the global SQLAlchemy ORM session and models for consistency.
"""

from sqlalchemy.orm import Session
from app.models.uploaded_file import UploadedFile

class UploadedFileRepository:
    """
    Repository for CRUD and queries on UploadedFile model.
    """

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        file_path: str,
        filename: str,
        file_type: str = None,
        description: str = None,
        associated_object: str = None,
        associated_object_id: int = None
    ):
        """
        Create and persist a new uploaded file record.
        """
        file = UploadedFile(
            user_id=user_id,
            file_path=file_path,
            filename=filename,
            file_type=file_type,
            description=description,
            associated_object=associated_object,
            associated_object_id=associated_object_id,
        )
        db.add(file)
        db.commit()
        db.refresh(file)
        return file

    @staticmethod
    def get_by_id(db: Session, uploaded_file_id: int):
        """
        Retrieve an uploaded file by primary key.
        """
        return db.query(UploadedFile).filter(UploadedFile.uploaded_file_id == uploaded_file_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: int):
        """
        List all files uploaded by a user.
        """
        return db.query(UploadedFile).filter(UploadedFile.user_id == user_id).all()

    @staticmethod
    def list_by_association(db: Session, associated_object: str, associated_object_id: int):
        """
        List all files associated with a particular object (e.g., course, submission).
        """
        return db.query(UploadedFile).filter(
            UploadedFile.associated_object == associated_object,
            UploadedFile.associated_object_id == associated_object_id
        ).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all uploaded files in the system.
        """
        return db.query(UploadedFile).all()

    @staticmethod
    def update(db: Session, uploaded_file_id: int, **kwargs):
        """
        Update uploaded file fields with provided values.
        """
        file = db.query(UploadedFile).filter(UploadedFile.uploaded_file_id == uploaded_file_id).first()
        if not file:
            return None
        for key, value in kwargs.items():
            setattr(file, key, value)
        db.commit()
        db.refresh(file)
        return file

    @staticmethod
    def delete(db: Session, uploaded_file_id: int):
        """
        Delete an uploaded file by its primary key.
        """
        file = db.query(UploadedFile).filter(UploadedFile.uploaded_file_id == uploaded_file_id).first()
        if not file:
            return False
        db.delete(file)
        db.commit()
        return True