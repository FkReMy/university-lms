"""
User Model (Production)
-----------------------
Represents a system user in the University LMS (student, professor, admin, etc.).

- No sample, demo, or test fields.
- Fully unified with global role, student, professor, specialization, and audit models.
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
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
    phone = Column(String(20), nullable=True)
    profile_image_path = Column(String(512), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    role_id = Column(Integer, ForeignKey("roles.role_id", ondelete="SET NULL"), nullable=True, index=True)
    specialization_id = Column(Integer, ForeignKey("specializations.specialization_id", ondelete="SET NULL"), nullable=True, index=True)
    last_login = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    role = relationship("Role", back_populates="users", lazy='select')
    student_profile = relationship("Student", back_populates="user", uselist=False, lazy='select')
    admin_profile = relationship("Admin", back_populates="user", uselist=False, lazy='select')
    professor_roles = relationship("Professor", back_populates="user", cascade="all, delete-orphan", lazy='select')
    associate_teacher_roles = relationship("AssociateTeacher", back_populates="user", cascade="all, delete-orphan", lazy='select')
    specialization = relationship("Specialization", back_populates="students", lazy='select')
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan", lazy='select')
    grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan", lazy='select')
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan", lazy='select')
    uploaded_files = relationship("UploadedFile", back_populates="user", cascade="all, delete-orphan", lazy='select')
    assignment_files = relationship("AssignmentFile", back_populates="uploaded_by", lazy='select')
    assignment_submissions = relationship("AssignmentSubmission", foreign_keys="AssignmentSubmission.student_id", back_populates="student", cascade="all, delete-orphan", lazy='select')

    @hybrid_property
    def full_name(self):
        """Computed property combining first_name and last_name for schema compatibility."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.first_name or self.last_name or ""

    @property
    def is_admin(self):
        """Check if user has admin role."""
        return self.role and self.role.name.lower() == "administrator"

    def __repr__(self):
        return (
            f"<User(user_id={self.user_id}, username='{self.username}', email='{self.email}', is_active={self.is_active})>"
        )