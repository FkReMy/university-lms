"""
Department Repository (Production)
----------------------------------
Provides data access patterns for the Department model.

- No sample, demo, or test code.
- All operations use global SQLAlchemy session and models.
"""

from sqlalchemy.orm import Session
from app.models.department import Department

class DepartmentRepository:
    """
    Repository for CRUD and queries on Department model.
    """

    @staticmethod
    def create(db: Session, name: str, code: str = None, description: str = None):
        """
        Create and persist a new department.
        """
        dept = Department(
            name=name,
            code=code,
            description=description,
        )
        db.add(dept)
        db.commit()
        db.refresh(dept)
        return dept

    @staticmethod
    def get_by_id(db: Session, dept_id: int):
        """
        Retrieve a department by its primary key.
        """
        return db.query(Department).filter(Department.dept_id == dept_id).first()

    @staticmethod
    def get_by_code(db: Session, code: str):
        """
        Retrieve a department by its code.
        """
        return db.query(Department).filter(Department.code == code).first()

    @staticmethod
    def list_all(db: Session):
        """
        List all departments.
        """
        return db.query(Department).all()

    @staticmethod
    def update(db: Session, dept_id: int, **kwargs):
        """
        Update a department with any provided fields.
        """
        dept = db.query(Department).filter(Department.dept_id == dept_id).first()
        if not dept:
            return None
        for key, value in kwargs.items():
            setattr(dept, key, value)
        db.commit()
        db.refresh(dept)
        return dept

    @staticmethod
    def delete(db: Session, dept_id: int):
        """
        Delete a department by its primary key.
        """
        dept = db.query(Department).filter(Department.dept_id == dept_id).first()
        if not dept:
            return False
        db.delete(dept)
        db.commit()
        return True