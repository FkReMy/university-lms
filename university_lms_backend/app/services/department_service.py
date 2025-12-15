"""
Department Service (Production)
-------------------------------
Service layer for managing Department entities, encapsulating CRUD operations and
business policies for departments within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and project-wide unification conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.department import Department
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)
from app.schemas.department import Department as DepartmentSchema

class DepartmentService:
    """
    Manages CRUD and business logic for departments.
    """

    @staticmethod
    def get_by_id(db: Session, department_id: int) -> Optional[DepartmentSchema]:
        """
        Retrieve a department by its unique identifier.
        """
        dept_obj = db.query(Department).filter(Department.department_id == department_id).first()
        return DepartmentSchema.from_orm(dept_obj) if dept_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[DepartmentSchema]:
        """
        Retrieve a paginated list of departments.
        """
        departments = db.query(Department).offset(skip).limit(limit).all()
        return [DepartmentSchema.from_orm(d) for d in departments]

    @staticmethod
    def create(db: Session, department_in: DepartmentCreate) -> DepartmentSchema:
        """
        Create and persist a new department.
        """
        dept_obj = Department(**department_in.dict())
        db.add(dept_obj)
        db.commit()
        db.refresh(dept_obj)
        return DepartmentSchema.from_orm(dept_obj)

    @staticmethod
    def update(
        db: Session,
        department_id: int,
        department_in: DepartmentUpdate
    ) -> Optional[DepartmentSchema]:
        """
        Update an existing department with provided fields.
        """
        dept_obj = db.query(Department).filter(Department.department_id == department_id).first()
        if not dept_obj:
            return None
        for field, value in department_in.dict(exclude_unset=True).items():
            setattr(dept_obj, field, value)
        db.commit()
        db.refresh(dept_obj)
        return DepartmentSchema.from_orm(dept_obj)

    @staticmethod
    def delete(db: Session, department_id: int) -> bool:
        """
        Delete a department by its ID. Returns True if deleted, False if not found.
        """
        dept_obj = db.query(Department).filter(Department.department_id == department_id).first()
        if not dept_obj:
            return False
        db.delete(dept_obj)
        db.commit()
        return True