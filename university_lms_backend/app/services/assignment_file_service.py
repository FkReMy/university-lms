"""
AssignmentFile Service (Production)
-----------------------------------
Service layer for managing AssignmentFile entities, providing CRUD operations 
and business logic for files attached to assignments in the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unification best practices for maintainability.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.assignment_file import AssignmentFile
from app.schemas.assignment_file import (
    AssignmentFileCreate,
    AssignmentFileUpdate,
)
from app.schemas.assignment_file import AssignmentFile as AssignmentFileSchema

class AssignmentFileService:
    """
    Handles all CRUD and business operations for assignment files.
    """

    @staticmethod
    def get_by_id(db: Session, assignment_file_id: int) -> Optional[AssignmentFileSchema]:
        """
        Retrieve an assignment file by its identifier.
        """
        file_obj = db.query(AssignmentFile).filter(AssignmentFile.assignment_file_id == assignment_file_id).first()
        return AssignmentFileSchema.from_orm(file_obj) if file_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[AssignmentFileSchema]:
        """
        Retrieve a list of assignment files, with optional pagination.
        """
        files = db.query(AssignmentFile).offset(skip).limit(limit).all()
        return [AssignmentFileSchema.from_orm(f) for f in files]

    @staticmethod
    def get_by_assignment_id(db: Session, assignment_id: int) -> List[AssignmentFileSchema]:
        """
        Retrieve all files attached to a specific assignment.
        """
        files = db.query(AssignmentFile).filter(AssignmentFile.assignment_id == assignment_id).all()
        return [AssignmentFileSchema.from_orm(f) for f in files]

    @staticmethod
    def create(db: Session, file_in: AssignmentFileCreate) -> AssignmentFileSchema:
        """
        Create and persist a new assignment file entry.
        """
        file_obj = AssignmentFile(**file_in.dict())
        db.add(file_obj)
        db.commit()
        db.refresh(file_obj)
        return AssignmentFileSchema.from_orm(file_obj)

    @staticmethod
    def update(
        db: Session, 
        assignment_file_id: int, 
        file_in: AssignmentFileUpdate
    ) -> Optional[AssignmentFileSchema]:
        """
        Update an existing assignment file's details.
        """
        file_obj = db.query(AssignmentFile).filter(AssignmentFile.assignment_file_id == assignment_file_id).first()
        if not file_obj:
            return None
        for field, value in file_in.dict(exclude_unset=True).items():
            setattr(file_obj, field, value)
        db.commit()
        db.refresh(file_obj)
        return AssignmentFileSchema.from_orm(file_obj)

    @staticmethod
    def delete(db: Session, assignment_file_id: int) -> bool:
        """
        Delete an assignment file by its ID. Returns True if deleted, False if not found.
        """
        file_obj = db.query(AssignmentFile).filter(AssignmentFile.assignment_file_id == assignment_file_id).first()
        if not file_obj:
            return False
        db.delete(file_obj)
        db.commit()
        return True