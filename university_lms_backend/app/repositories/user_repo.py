"""
User Repository (Production)
----------------------------
Handles all CRUD, authentication, and query operations on User entities in the LMS.

- No sample, demo, or test code.
- Uses global SQLAlchemy ORM session and model patterns.
"""

from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User

class UserRepository:
    """
    Repository for CRUD, authentication, and queries on the User model.
    """

    @staticmethod
    def create(
        db: Session,
        username: str,
        email: str,
        password_hash: str,
        first_name: str = "",
        last_name: str = "",
        phone: str = None,
        is_active: bool = True,
        is_verified: bool = False,
        role_id: int = None
    ):
        """
        Create and persist a new user.
        """
        user = User(
            username=username,
            email=email,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            is_active=is_active,
            is_verified=is_verified,
            role_id=role_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_by_id(db: Session, user_id: int):
        """
        Retrieve a user by their primary key.
        """
        stmt = select(User).where(User.user_id == user_id)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_by_username(db: Session, username: str):
        """
        Retrieve a user by username (unique).
        """
        stmt = select(User).where(User.username == username)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_by_email(db: Session, email: str):
        """
        Retrieve a user by email address (unique).
        """
        stmt = select(User).where(User.email == email)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def list_all(db: Session):
        """
        List all users in the LMS.
        """
        stmt = select(User)
        return db.execute(stmt).scalars().all()

    @staticmethod
    def authenticate(db: Session, username: str, password_hash: str):
        """
        Authenticate a user by username and password hash.
        (NOTE: Password validation and hashing is handled at the service layer.)
        """
        stmt = select(User).where(
            User.username == username,
            User.password_hash == password_hash,
            User.is_active == True
        )
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def update(db: Session, user_id: int, **kwargs):
        """
        Update user fields with provided values.
        """
        stmt = select(User).where(User.user_id == user_id)
        user = db.execute(stmt).scalar_one_or_none()
        if not user:
            return None
        for key, value in kwargs.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete(db: Session, user_id: int):
        """
        Delete a user by primary key.
        """
        stmt = select(User).where(User.user_id == user_id)
        user = db.execute(stmt).scalar_one_or_none()
        if not user:
            return False
        db.delete(user)
        db.commit()
        return True