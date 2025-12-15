"""
AssignmentFile Repository (Production)
--------------------------------------
Handles DB operations related to assignment-supporting files (instructions, resources, etc).

- No sample, demo, or test code.
- Uses global SQLAlchemy session, models, and consistency patterns.
"""

from sqlalchemy.orm import Session
from app.models.assignment_file import AssignmentFile

class AssignmentFileRepository:
    """
    Repository for assignment-attached file operations (CRUD).
    """

    @staticmethod
    def create(db: Session, assignment_id: int, filename: str, file_path: str, uploaded_by_id: int, content_type: str):
        """
        Create a new assignment file reference (DB row).
        """
        file = AssignmentFile(
            assignment_id=assignment_id,
            filename=filename,
            file_path=file_path,
            uploaded_by_id=uploaded_by_id,
            content_type=content_type,
        )
        db.add(file)
        db.commit()
        db.refresh(file)
        return file

    @staticmethod
    def get_by_id(db: Session, file_id: int):
        """
        Returns a file by its database primary key.
        """
        return db.query(AssignmentFile).filter(AssignmentFile.file_id == file_id).first()

    @staticmethod
    def list_by_assignment(db: Session, assignment_id: int):
        """
        Returns all files for an assignment.
        """
        return db.query(AssignmentFile).filter(AssignmentFile.assignment_id == assignment_id).all()

    @staticmethod
    def delete(db: Session, file_id: int):
        """
        Deletes an assignment file by primary key.
        """
        file = db.query(AssignmentFile).filter(AssignmentFile.file_id == file_id).first()
        if not file:
            return False
        db.delete(file)
        db.commit()
        return True