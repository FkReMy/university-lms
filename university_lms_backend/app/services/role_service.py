"""
Role Service (Production)
-------------------------
Service layer for managing Role entities, implementing CRUD operations and business logic 
for system roles within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified project conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.role import Role
from app.schemas.role import (
    RoleCreate,
    RoleUpdate,
)
from app.schemas.role import Role as RoleSchema

class RoleService:
    """
    Handles CRUD and business logic for role records.
    """

    @staticmethod
    def get_by_id(db: Session, role_id: int) -> Optional[RoleSchema]:
        """
        Retrieve a role by its unique identifier.
        """
        role_obj = db.query(Role).filter(Role.role_id == role_id).first()
        return RoleSchema.from_orm(role_obj) if role_obj else None

    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[RoleSchema]:
        """
        Retrieve a role by its unique name.
        """
        role_obj = db.query(Role).filter(Role.name == name).first()
        return RoleSchema.from_orm(role_obj) if role_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[RoleSchema]:
        """
        Retrieve a paginated list of all roles.
        """
        roles = db.query(Role).offset(skip).limit(limit).all()
        return [RoleSchema.from_orm(r) for r in roles]

    @staticmethod
    def create(db: Session, role_in: RoleCreate) -> RoleSchema:
        """
        Create and persist a new role record.
        """
        role_obj = Role(**role_in.dict())
        db.add(role_obj)
        db.commit()
        db.refresh(role_obj)
        return RoleSchema.from_orm(role_obj)

    @staticmethod
    def update(
        db: Session,
        role_id: int,
        role_in: RoleUpdate
    ) -> Optional[RoleSchema]:
        """
        Update an existing role with provided fields.
        """
        role_obj = db.query(Role).filter(Role.role_id == role_id).first()
        if not role_obj:
            return None
        for field, value in role_in.dict(exclude_unset=True).items():
            setattr(role_obj, field, value)
        db.commit()
        db.refresh(role_obj)
        return RoleSchema.from_orm(role_obj)

    @staticmethod
    def delete(db: Session, role_id: int) -> bool:
        """
        Delete a role by its ID. Returns True if deleted, False if not found.
        """
        role_obj = db.query(Role).filter(Role.role_id == role_id).first()
        if not role_obj:
            return False
        db.delete(role_obj)
        db.commit()
        return True