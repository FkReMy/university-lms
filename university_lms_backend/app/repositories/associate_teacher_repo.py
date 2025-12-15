"""
AssociateTeacher Repository (Production)
----------------------------------------
Handles data access operations for associate teachers (adjuncts, teaching assistants, etc).

- No sample, demo, or test code.
- All interactions use global models and session patterns.
"""

from sqlalchemy.orm import Session
from app.models.associate_teacher import AssociateTeacher

class AssociateTeacherRepository:
    """
    Repository to provide CRUD and business-access for AssociateTeacher model.
    """

    @staticmethod
    def create(db: Session, user_id: int, department_id: int, start_date=None, end_date=None, status: str = "active"):
        """
        Insert a new associate teacher record.
        """
        assoc = AssociateTeacher(
            user_id=user_id,
            department_id=department_id,
            start_date=start_date,
            end_date=end_date,
            status=status,
        )
        db.add(assoc)
        db.commit()
        db.refresh(assoc)
        return assoc

    @staticmethod
    def get_by_id(db: Session, associate_teacher_id: int):
        """
        Retrieve by associate teacher's primary key.
        """
        return db.query(AssociateTeacher).filter(AssociateTeacher.associate_teacher_id == associate_teacher_id).first()

    @staticmethod
    def list_by_department(db: Session, department_id: int):
        """
        List all associate teachers by department.
        """
        return db.query(AssociateTeacher).filter(AssociateTeacher.department_id == department_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all associate teachers in the system.
        """
        return db.query(AssociateTeacher).all()

    @staticmethod
    def update(db: Session, associate_teacher_id: int, **kwargs):
        """
        Update an associate teacher's attributes (partial update allowed).
        """
        assoc = db.query(AssociateTeacher).filter(AssociateTeacher.associate_teacher_id == associate_teacher_id).first()
        if not assoc:
            return None
        for key, value in kwargs.items():
            setattr(assoc, key, value)
        db.commit()
        db.refresh(assoc)
        return assoc

    @staticmethod
    def delete(db: Session, associate_teacher_id: int):
        """
        Delete an associate teacher by PK.
        """
        assoc = db.query(AssociateTeacher).filter(AssociateTeacher.associate_teacher_id == associate_teacher_id).first()
        if not assoc:
            return False
        db.delete(assoc)
        db.commit()
        return True