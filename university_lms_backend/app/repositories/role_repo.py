"""
Role Repository (Production)
----------------------------
Handles CRUD and query operations for system roles (e.g., student, professor, admin).

- No sample, demo, or test code.
- Unified via global models and SQLAlchemy session management.
"""

from sqlalchemy.orm import Session
from app.models.role import Role

class RoleRepository:
    """
    Repository for business logic and data access for role entities.
    """

    @staticmethod
    def create(db: Session, name: str, description: str = None):
        """
        Create and persist a new role.
        """
        role = Role(
            name=name,
            description=description,
        )
        db.add(role)
        db.commit()
        db.refresh(role)
        return role

    @staticmethod
    def get_by_id(db: Session, role_id: int):
        """
        Retrieve a role by primary key.
        """
        return db.query(Role).filter(Role.role_id == role_id).first()

    @staticmethod
    def get_by_name(db: Session, name: str):
        """
        Retrieve a role by its unique name.
        """
        return db.query(Role).filter(Role.name == name).first()

    @staticmethod
    def list_all(db: Session):
        """
        List all roles in the system.
        """
        return db.query(Role).all()

    @staticmethod
    def update(db: Session, role_id: int, **kwargs):
        """
        Update role fields with provided values.
        """
        role = db.query(Role).filter(Role.role_id == role_id).first()
        if not role:
            return None
        for key, value in kwargs.items():
            setattr(role, key, value)
        db.commit()
        db.refresh(role)
        return role

    @staticmethod
    def delete(db: Session, role_id: int):
        """
        Delete a role by primary key.
        """
        role = db.query(Role).filter(Role.role_id == role_id).first()
        if not role:
            return False
        db.delete(role)
        db.commit()
        return True