"""
Admin Repository (Production)
-----------------------------
Provides data access methods for Admin-specific operations and admin accounts.

- No sample, demo, or test code included.
- All interactions are unified for global admin/user management flows.
"""

from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.models.user import User

class AdminRepository:
    """
    Repository for Admin account and management data operations.
    """

    @staticmethod
    def create_admin(db: Session, user_id: int, created_by: int = None):
        """
        Create an admin record mapped to a user.
        """
        admin = Admin(
            user_id=user_id,
            created_by=created_by,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        return admin

    @staticmethod
    def get_by_id(db: Session, admin_id: int):
        """
        Retrieve admin record by primary key.
        """
        return db.query(Admin).filter(Admin.admin_id == admin_id).first()

    @staticmethod
    def get_by_user_id(db: Session, user_id: int):
        """
        Retrieve admin record by associated user_id.
        """
        return db.query(Admin).filter(Admin.user_id == user_id).first()

    @staticmethod
    def list_all(db: Session):
        """
        List all admin records in the system.
        """
        return db.query(Admin).all()

    @staticmethod
    def list_admin_users(db: Session):
        """
        List all users who have admin accounts.
        """
        return db.query(User).join(Admin, User.user_id == Admin.user_id).all()

    @staticmethod
    def delete_admin(db: Session, admin_id: int):
        """
        Delete an admin record by admin_id.
        """
        admin = db.query(Admin).filter(Admin.admin_id == admin_id).first()
        if not admin:
            return False
        db.delete(admin)
        db.commit()
        return True