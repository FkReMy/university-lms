"""
Grade Repository (Production)
-----------------------------
Handles CRUD and queries for grade records (student performance per assignment, quiz, or final).

- No sample, demo, or test code.
- Uses global SQLAlchemy session and models.
"""

from sqlalchemy.orm import Session
from app.models.grade import Grade

class GradeRepository:
    """
    Repository for handling Grade model operations.
    """

    @staticmethod
    def create(db: Session, student_id: int, course_offering_id: int, graded_item_type: str, graded_item_id: int, points: float, remarks: str = None):
        """
        Create and persist a new grade record.
        """
        grade = Grade(
            student_id=student_id,
            course_offering_id=course_offering_id,
            graded_item_type=graded_item_type,
            graded_item_id=graded_item_id,
            points=points,
            remarks=remarks,
        )
        db.add(grade)
        db.commit()
        db.refresh(grade)
        return grade

    @staticmethod
    def get_by_id(db: Session, grade_id: int):
        """
        Get a grade record by its primary key.
        """
        return db.query(Grade).filter(Grade.grade_id == grade_id).first()

    @staticmethod
    def list_by_student(db: Session, student_id: int):
        """
        List all grades for a given student.
        """
        return db.query(Grade).filter(Grade.student_id == student_id).all()

    @staticmethod
    def list_by_course_offering(db: Session, course_offering_id: int):
        """
        List all grades for a course offering.
        """
        return db.query(Grade).filter(Grade.course_offering_id == course_offering_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all grades in the system.
        """
        return db.query(Grade).all()

    @staticmethod
    def update(db: Session, grade_id: int, **kwargs):
        """
        Update a grade with the provided field(s).
        """
        grade = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not grade:
            return None
        for key, value in kwargs.items():
            setattr(grade, key, value)
        db.commit()
        db.refresh(grade)
        return grade

    @staticmethod
    def delete(db: Session, grade_id: int):
        """
        Delete a grade record by primary key.
        """
        grade = db.query(Grade).filter(Grade.grade_id == grade_id).first()
        if not grade:
            return False
        db.delete(grade)
        db.commit()
        return True