"""
Student Service (Production)
----------------------------
Service layer for managing Student entities, encapsulating CRUD operations
and business policies for students within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.student import Student
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
)
from app.schemas.student import Student as StudentSchema

class StudentService:
    """
    Handles CRUD and business logic for student records.
    """

    @staticmethod
    def get_by_id(db: Session, student_id: int) -> Optional[StudentSchema]:
        """
        Retrieve a student by their unique identifier.
        """
        student_obj = db.query(Student).filter(Student.student_id == student_id).first()
        return StudentSchema.from_orm(student_obj) if student_obj else None

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[StudentSchema]:
        """
        Retrieve a student by the linked user account ID.
        """
        student_obj = db.query(Student).filter(Student.user_id == user_id).first()
        return StudentSchema.from_orm(student_obj) if student_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[StudentSchema]:
        """
        Retrieve a paginated list of all students.
        """
        students = db.query(Student).offset(skip).limit(limit).all()
        return [StudentSchema.from_orm(s) for s in students]

    @staticmethod
    def create(db: Session, student_in: StudentCreate) -> StudentSchema:
        """
        Create and persist a new student record.
        """
        student_obj = Student(**student_in.dict())
        db.add(student_obj)
        db.commit()
        db.refresh(student_obj)
        return StudentSchema.from_orm(student_obj)

    @staticmethod
    def update(
        db: Session,
        student_id: int,
        student_in: StudentUpdate
    ) -> Optional[StudentSchema]:
        """
        Update an existing student record with provided fields.
        """
        student_obj = db.query(Student).filter(Student.student_id == student_id).first()
        if not student_obj:
            return None
        for field, value in student_in.dict(exclude_unset=True).items():
            setattr(student_obj, field, value)
        db.commit()
        db.refresh(student_obj)
        return StudentSchema.from_orm(student_obj)

    @staticmethod
    def delete(db: Session, student_id: int) -> bool:
        """
        Delete a student by their ID. Returns True if deleted, False if not found.
        """
        student_obj = db.query(Student).filter(Student.student_id == student_id).first()
        if not student_obj:
            return False
        db.delete(student_obj)
        db.commit()
        return True