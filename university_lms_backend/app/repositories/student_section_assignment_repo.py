"""
StudentSectionAssignment Repository (Production)
------------------------------------------------
Handles CRUD and query operations for student-section group assignments (linking students with sections/groups).

- No sample, demo, or test code.
- Uses global SQLAlchemy models and session patterns for LMS unification.
"""

from sqlalchemy.orm import Session
from app.models.student_section_assignment import StudentSectionAssignment

class StudentSectionAssignmentRepository:
    """
    Repository for StudentSectionAssignment CRUD and business logic.
    """

    @staticmethod
    def create(db: Session, student_id: int, group_id: int, assigned_at = None):
        """
        Create and persist a new student-section group assignment.
        """
        assignment = StudentSectionAssignment(
            student_id=student_id,
            group_id=group_id,
            assigned_at=assigned_at,
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def get_by_id(db: Session, assignment_id: int):
        """
        Retrieve student-section assignment by primary key.
        """
        return db.query(StudentSectionAssignment).filter(StudentSectionAssignment.assignment_id == assignment_id).first()

    @staticmethod
    def list_by_student(db: Session, student_id: int):
        """
        List all section/group assignments for a single student.
        """
        return db.query(StudentSectionAssignment).filter(StudentSectionAssignment.student_id == student_id).all()

    @staticmethod
    def list_by_group(db: Session, group_id: int):
        """
        List all student assignments for a group/section.
        """
        return db.query(StudentSectionAssignment).filter(StudentSectionAssignment.group_id == group_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all student-section assignments in the system.
        """
        return db.query(StudentSectionAssignment).all()

    @staticmethod
    def update(db: Session, assignment_id: int, **kwargs):
        """
        Update an assignment record with provided changes.
        """
        assignment = db.query(StudentSectionAssignment).filter(StudentSectionAssignment.assignment_id == assignment_id).first()
        if not assignment:
            return None
        for key, value in kwargs.items():
            setattr(assignment, key, value)
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def delete(db: Session, assignment_id: int):
        """
        Delete a student-section assignment by primary key.
        """
        assignment = db.query(StudentSectionAssignment).filter(StudentSectionAssignment.assignment_id == assignment_id).first()
        if not assignment:
            return False
        db.delete(assignment)
        db.commit()
        return True