"""
Student Repository (Production)
-------------------------------
Handles CRUD and query logic for students within the LMS.

- No sample, demo, or test code.
- All persistence uses global SQLAlchemy session and model conventions.
"""

from sqlalchemy.orm import Session
from app.models.student import Student

class StudentRepository:
    """
    Repository for Student entity business logic and persistence.
    """

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        admission_number: str,
        enrollment_year: int = None,
        status: str = "active",
        specialization_id: int = None
    ):
        """
        Create and persist a new student record.
        """
        student = Student(
            user_id=user_id,
            admission_number=admission_number,
            enrollment_year=enrollment_year,
            status=status,
            specialization_id=specialization_id,
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        return student

    @staticmethod
    def get_by_id(db: Session, student_id: int):
        """
        Get a student by primary key.
        """
        return db.query(Student).filter(Student.student_id == student_id).first()

    @staticmethod
    def get_by_user_id(db: Session, user_id: int):
        """
        Get a student by user account.
        """
        return db.query(Student).filter(Student.user_id == user_id).first()

    @staticmethod
    def get_by_admission_number(db: Session, admission_number: str):
        """
        Get a student by admission number (unique).
        """
        return db.query(Student).filter(Student.admission_number == admission_number).first()

    @staticmethod
    def list_by_specialization(db: Session, specialization_id: int):
        """
        List all students in a given specialization.
        """
        return db.query(Student).filter(Student.specialization_id == specialization_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all students.
        """
        return db.query(Student).all()

    @staticmethod
    def update(db: Session, student_id: int, **kwargs):
        """
        Update provided student fields by student_id.
        """
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            return None
        for key, value in kwargs.items():
            setattr(student, key, value)
        db.commit()
        db.refresh(student)
        return student

    @staticmethod
    def delete(db: Session, student_id: int):
        """
        Delete a student record by primary key.
        """
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            return False
        db.delete(student)
        db.commit()
        return True