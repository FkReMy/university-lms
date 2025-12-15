"""
Admin Service (Production)
--------------------------
Service layer for handling administrator user operations within the LMS application.

- No sample, demo, or test code.
- Uses global models, schemas, and unified design patterns for maintainability.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.admin import Admin
from app.schemas.admin import (
    AdminCreate,
    AdminUpdate,
)
from app.schemas.admin import Admin as AdminSchema

class AdminService:
    """
    Encapsulates the logic for CRUD and business operations on Admin users.
    """

    @staticmethod
    def get_by_id(db: Session, admin_id: int) -> Optional[AdminSchema]:
        """
        Retrieve an administrator by their ID.
        """
        admin = db.query(Admin).filter(Admin.admin_id == admin_id).first()
        return AdminSchema.from_orm(admin) if admin else None

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> Optional[AdminSchema]:
        """
        Retrieve an administrator by the linked user account's ID.
        """
        admin = db.query(Admin).filter(Admin.user_id == user_id).first()
        return AdminSchema.from_orm(admin) if admin else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[AdminSchema]:
        """
        Retrieve all administrators with optional pagination.
        """
        admins = db.query(Admin).offset(skip).limit(limit).all()
        return [AdminSchema.from_orm(a) for a in admins]

    @staticmethod
    def create(db: Session, admin_in: AdminCreate) -> AdminSchema:
        """
        Create and persist a new administrator.
        """
        admin_obj = Admin(**admin_in.dict())
        db.add(admin_obj)
        db.commit()
        db.refresh(admin_obj)
        return AdminSchema.from_orm(admin_obj)

    @staticmethod
    def update(db: Session, admin_id: int, admin_in: AdminUpdate) -> Optional[AdminSchema]:
        """
        Update details of an existing administrator.
        """
        admin_obj = db.query(Admin).filter(Admin.admin_id == admin_id).first()
        if not admin_obj:
            return None
        for field, value in admin_in.dict(exclude_unset=True).items():
            setattr(admin_obj, field, value)
        db.commit()
        db.refresh(admin_obj)
        return AdminSchema.from_orm(admin_obj)

    @staticmethod
    def delete(db: Session, admin_id: int) -> bool:
        """
        Delete an administrator by ID.
        Returns True if the admin was deleted, False if not found.
        """
        admin_obj = db.query(Admin).filter(Admin.admin_id == admin_id).first()
        if not admin_obj:
            return False
        db.delete(admin_obj)
        db.commit()
        return True