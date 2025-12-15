"""
Enrollment Repository (Production)
----------------------------------
Handles CRUD operations and queries for enrollment records (students registered in course offerings).

- No sample, demo, or test code.
- Uses global SQLAlchemy session and model patterns across LMS.
"""

from sqlalchemy.orm import Session
from app.models.enrollment import Enrollment

class EnrollmentRepository:
    """
    Repository for Enrollment entities (student-course offering links).
    """

    @staticmethod
    def create(db: Session, student_id: int, course_offering_id: int, enrolled_at=None, status: str = "enrolled", section_group_id: int = None):
        """
        Insert a new enrollment record.
        """
        enrollment = Enrollment(
            student_id=student_id,
            course_offering_id=course_offering_id,
            enrolled_at=enrolled_at,
            status=status,
            section_group_id=section_group_id,
        )
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
        return enrollment

    @staticmethod
    def get_by_id(db: Session, enrollment_id: int):
        """
        Retrieve an enrollment record by primary key.
        """
        return db.query(Enrollment).filter(Enrollment.enrollment_id == enrollment_id).first()

    @staticmethod
    def list_by_student(db: Session, student_id: int):
        """
        List all enrollments for a given student.
        """
        return db.query(Enrollment).filter(Enrollment.student_id == student_id).all()

    @staticmethod
    def list_by_course_offering(db: Session, course_offering_id: int):
        """
        List all enrollments for a specific course offering.
        """
        return db.query(Enrollment).filter(Enrollment.course_offering_id == course_offering_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all enrollments.
        """
        return db.query(Enrollment).all()

    @staticmethod
    def update(db: Session, enrollment_id: int, **kwargs):
        """
        Update an enrollment with provided field changes.
        """
        enrollment = db.query(Enrollment).filter(Enrollment.enrollment_id == enrollment_id).first()
        if not enrollment:
            return None
        for key, value in kwargs.items():
            setattr(enrollment, key, value)
        db.commit()
        db.refresh(enrollment)
        return enrollment

    @staticmethod
    def delete(db: Session, enrollment_id: int):
        """
        Delete an enrollment record by its primary key.
        """
        enrollment = db.query(Enrollment).filter(Enrollment.enrollment_id == enrollment_id).first()
        if not enrollment:
            return False
        db.delete(enrollment)
        db.commit()
        return True