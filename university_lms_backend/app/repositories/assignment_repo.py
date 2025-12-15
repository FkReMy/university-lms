"""
Assignment Repository (Production)
----------------------------------
Handles data access operations for Assignment model (CRUD, business queries).

- No sample, demo, or test code included.
- All DB actions use global models and session management.
"""

from sqlalchemy.orm import Session
from app.models.assignment import Assignment

class AssignmentRepository:
    """
    Repository providing CRUD for Assignment model.
    """

    @staticmethod
    def create(db: Session, course_offering_id: int, title: str, description: str = None, due_date=None, max_points: int = 100):
        """
        Create and persist a new assignment for a course offering.
        """
        assignment = Assignment(
            course_offering_id=course_offering_id,
            title=title,
            description=description,
            due_date=due_date,
            max_points=max_points,
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    @staticmethod
    def get_by_id(db: Session, assignment_id: int):
        """
        Get assignment by primary key.
        """
        return db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()

    @staticmethod
    def list_by_course_offering(db: Session, course_offering_id: int):
        """
        List assignments for the given course offering.
        """
        return db.query(Assignment).filter(Assignment.course_offering_id == course_offering_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all assignments.
        """
        return db.query(Assignment).all()

    @staticmethod
    def update(db: Session, assignment_id: int, **kwargs):
        """
        Update an assignment; accepts fields like title, description, due_date, max_points.
        """
        assignment = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
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
        Delete assignment by primary key.
        """
        assignment = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
        if not assignment:
            return False
        db.delete(assignment)
        db.commit()
        return True