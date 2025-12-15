"""
User Model (Production)
-----------------------
Represents a system user in the University LMS (student, professor, admin, etc.).

- No sample, demo, or test fields.
- Fully unified with global role, student, professor, specialization, and audit models.
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from app.models.base import Base

class User(Base):
    """
    Database model for LMS users, encapsulating authentication, identity, and profile information.
    All system actors (students, professors, admins) are represented by this model.
    """
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String(64), nullable=False, unique=True, index=True)
    email = Column(String(128), nullable=False, unique=True, index=True)
    password_hash = Column(String(256), nullable=False)
    first_name = Column(String(64), nullable=False)
    last_name = Column(String(64), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    role_id = Column(Integer, ForeignKey("roles.role_id", ondelete="SET NULL"), nullable=True, index=True)
    specialization_id = Column(Integer, ForeignKey("specializations.specialization_id", ondelete="SET NULL"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    role = relationship("Role", back_populates="users")
    student_profile = relationship("Student", back_populates="user", uselist=False)
    professor_roles = relationship("Professor", back_populates="user", cascade="all, delete-orphan")
    specialization = relationship("Specialization", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    uploaded_files = relationship("UploadedFile", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return (
            f"<User(user_id={self.user_id}, username='{self.username}', email='{self.email}', is_active={self.is_active})>"
        )