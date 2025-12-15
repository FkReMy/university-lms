"""
Admin Model (Production)
------------------------
Represents administrative users in the University LMS system.

- No sample/demo/test fields or logic, only real production attributes.
- Uses unified global user/role system.
- Extends from base for audit fields and ID.
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, String
from sqlalchemy.orm import relationship

from app.models.base import Base

class Admin(Base):
    """
    Database model for admin users.
    Each admin is a user with elevated platform-level privileges.
    """
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship to the User model (unified user table)
    user = relationship("User", back_populates="admin_profile", uselist=False)

    # Example: admin role string (global, can be extended for RBAC)
    role = Column(String(32), nullable=False, default="admin")

    def __repr__(self):
        return f"<Admin(admin_id={self.admin_id}, user_id={self.user_id}, role='{self.role}')>"