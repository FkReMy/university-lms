"""
StudentSectionAssignment Service (Production)
---------------------------------------------
Service layer for managing StudentSectionAssignment entities, providing CRUD operations
and business logic for student-to-section group assignments in the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.student_section_assignment import StudentSectionAssignment
from app.schemas.student_section_assignment import (
    StudentSectionAssignmentCreate,
    StudentSectionAssignmentUpdate,
)
from app.schemas.student_section_assignment import StudentSectionAssignment as StudentSectionAssignmentSchema

class StudentSectionAssignmentService:
    """
    Handles CRUD and business operations for student section assignments.
    """

    @staticmethod
    def get_by_id(db: Session, student_section_assignment_id: int) -> Optional[StudentSectionAssignmentSchema]:
        """
        Retrieve a student section assignment by unique identifier.
        """
        assign_obj = db.query(StudentSectionAssignment).filter(
            StudentSectionAssignment.student_section_assignment_id == student_section_assignment_id
        ).first()
        return StudentSectionAssignmentSchema.from_orm(assign_obj) if assign_obj else None

    @staticmethod
    def get_by_section_group_id(db: Session, section_group_id: int) -> List[StudentSectionAssignmentSchema]:
        """
        Retrieve all student section assignments for a specific section group.
        """
        assignments = db.query(StudentSectionAssignment).filter(
            StudentSectionAssignment.section_group_id == section_group_id
        ).all()
        return [StudentSectionAssignmentSchema.from_orm(a) for a in assignments]

    @staticmethod
    def get_by_student_id(db: Session, student_id: int) -> List[StudentSectionAssignmentSchema]:
        """
        Retrieve all section assignments for a specific student.
        """
        assignments = db.query(StudentSectionAssignment).filter(
            StudentSectionAssignment.student_id == student_id
        ).all()
        return [StudentSectionAssignmentSchema.from_orm(a) for a in assignments]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[StudentSectionAssignmentSchema]:
        """
        Retrieve a paginated list of all student section assignments.
        """
        assignments = db.query(StudentSectionAssignment).offset(skip).limit(limit).all()
        return [StudentSectionAssignmentSchema.from_orm(a) for a in assignments]

    @staticmethod
    def create(db: Session, assign_in: StudentSectionAssignmentCreate) -> StudentSectionAssignmentSchema:
        """
        Create and persist a new student section assignment record.
        """
        assign_obj = StudentSectionAssignment(**assign_in.dict())
        db.add(assign_obj)
        db.commit()
        db.refresh(assign_obj)
        return StudentSectionAssignmentSchema.from_orm(assign_obj)

    @staticmethod
    def update(
        db: Session,
        student_section_assignment_id: int,
        assign_in: StudentSectionAssignmentUpdate
    ) -> Optional[StudentSectionAssignmentSchema]:
        """
        Update fields of an existing student section assignment.
        """
        assign_obj = db.query(StudentSectionAssignment).filter(
            StudentSectionAssignment.student_section_assignment_id == student_section_assignment_id
        ).first()
        if not assign_obj:
            return None
        for field, value in assign_in.dict(exclude_unset=True).items():
            setattr(assign_obj, field, value)
        db.commit()
        db.refresh(assign_obj)
        return StudentSectionAssignmentSchema.from_orm(assign_obj)

    @staticmethod
    def delete(db: Session, student_section_assignment_id: int) -> bool:
        """
        Delete a student section assignment by its ID. Returns True if deleted, False if not found.
        """
        assign_obj = db.query(StudentSectionAssignment).filter(
            StudentSectionAssignment.student_section_assignment_id == student_section_assignment_id
        ).first()
        if not assign_obj:
            return False
        db.delete(assign_obj)
        db.commit()
        return True