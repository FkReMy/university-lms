"""
Role Model (Production)
-----------------------
Represents a user role in the University LMS (e.g., student, professor, admin).

- No sample, demo, or test fields.
- Fully unified for RBAC, staff, and account management.
"""

from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Role(Base):
    """
    Database model for roles that users can have in the LMS.
    Standardized for RBAC (Role-Based Access Control).
    """
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(64), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship: many users can share the same role
    users = relationship("User", back_populates="role")

    def __repr__(self):
        return f"<Role(role_id={self.role_id}, name='{self.name}')>"