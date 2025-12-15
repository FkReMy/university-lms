"""
User Service (Production)
-------------------------
Service layer for managing User entities and implementing all associated business logic.

- Uses global models and schemas for data integrity and consistency.
- Explicit mapping between Pydantic and ORM models (solving status/is_active mismatch).
- Strictly avoids sample/demo code, follows production patterns.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    User as UserSchema,
)

class UserService:
    """
    Handles CRUD and business logic for users.
    """

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[UserSchema]:
        """
        Retrieve a user by their unique identifier.
        """
        user_obj = db.query(User).filter(User.user_id == user_id).first()
        return UserSchema.from_orm(user_obj) if user_obj else None

    @staticmethod
    def get_by_username(db: Session, username: str) -> Optional[UserSchema]:
        """
        Retrieve a user by their unique username.
        """
        user_obj = db.query(User).filter(User.username == username).first()
        return UserSchema.from_orm(user_obj) if user_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[UserSchema]:
        """
        Retrieve a paginated list of all users.
        """
        users = db.query(User).offset(skip).limit(limit).all()
        return [UserSchema.from_orm(u) for u in users]

    @staticmethod
    def create(db: Session, user_in: UserCreate) -> UserSchema:
        """
        Create and persist a new user record, mapping the status field to is_active.
        """
        user_data = user_in.dict()
        # Convert status string to is_active boolean
        status = user_data.pop("status", "active")
        user_data["is_active"] = (status == "active")
        user_obj = User(**user_data)
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)
        return UserSchema.from_orm(user_obj)

    @staticmethod
    def update(
        db: Session,
        user_id: int,
        user_in: UserUpdate
    ) -> Optional[UserSchema]:
        """
        Update an existing user record with provided fields, mapping status as needed.
        """
        user_obj = db.query(User).filter(User.user_id == user_id).first()
        if not user_obj:
            return None
        update_data = user_in.dict(exclude_unset=True)
        if "status" in update_data:
            # Map status string to is_active boolean
            status = update_data.pop("status")
            update_data["is_active"] = (status == "active")
        for field, value in update_data.items():
            setattr(user_obj, field, value)
        db.commit()
        db.refresh(user_obj)
        return UserSchema.from_orm(user_obj)

    @staticmethod
    def delete(db: Session, user_id: int) -> bool:
        """
        Delete a user by their ID. Returns True if deleted, False if not found.
        """
        user_obj = db.query(User).filter(User.user_id == user_id).first()
        if not user_obj:
            return False
        db.delete(user_obj)
        db.commit()
        return True