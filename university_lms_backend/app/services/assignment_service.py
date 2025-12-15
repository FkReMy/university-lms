"""
Assignment Service (Production)
-------------------------------
Service layer for managing Assignment entities, implementing CRUD operations and business logic
for assignments within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unification best practices for maintainability.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.assignment import Assignment
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentUpdate,
)
from app.schemas.assignment import Assignment as AssignmentSchema

class AssignmentService:
    """
    Encapsulates CRUD and business operations for assignment records.
    """

    @staticmethod
    def get_by_id(db: Session, assignment_id: int) -> Optional[AssignmentSchema]:
        """
        Retrieve an assignment by its identifier.
        """
        assignment_obj = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
        return AssignmentSchema.from_orm(assignment_obj) if assignment_obj else None

    @staticmethod
    def get_by_course_offering_id(db: Session, course_offering_id: int) -> List[AssignmentSchema]:
        """
        Retrieve all assignments for a specific course offering.
        """
        assignments = db.query(Assignment).filter(Assignment.course_offering_id == course_offering_id).all()
        return [AssignmentSchema.from_orm(a) for a in assignments]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[AssignmentSchema]:
        """
        Retrieve a paginated list of all assignments.
        """
        assignments = db.query(Assignment).offset(skip).limit(limit).all()
        return [AssignmentSchema.from_orm(a) for a in assignments]

    @staticmethod
    def create(db: Session, assignment_in: AssignmentCreate) -> AssignmentSchema:
        """
        Create and persist a new assignment.
        """
        assignment_obj = Assignment(**assignment_in.dict())
        db.add(assignment_obj)
        db.commit()
        db.refresh(assignment_obj)
        return AssignmentSchema.from_orm(assignment_obj)

    @staticmethod
    def update(
        db: Session,
        assignment_id: int,
        assignment_in: AssignmentUpdate
    ) -> Optional[AssignmentSchema]:
        """
        Update an existing assignment by its identifier.
        """
        assignment_obj = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
        if not assignment_obj:
            return None
        for field, value in assignment_in.dict(exclude_unset=True).items():
            setattr(assignment_obj, field, value)
        db.commit()
        db.refresh(assignment_obj)
        return AssignmentSchema.from_orm(assignment_obj)

    @staticmethod
    def delete(db: Session, assignment_id: int) -> bool:
        """
        Delete an assignment by its ID. Returns True if deleted, False if not found.
        """
        assignment_obj = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
        if not assignment_obj:
            return False
        db.delete(assignment_obj)
        db.commit()
        return True