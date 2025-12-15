"""
CourseOffering Model (Production)
---------------------------------
Represents a specific instance of a course offered in an academic session, possibly with
instructors and section groups.

- No sample/demo/test fields.
- Unified with global course, session, and department structures.
- Supports audit, staff assignments, and student enrollments.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class CourseOffering(Base):
    """
    Database model for a course offering (calendar instance of a catalog course).
    """
    __tablename__ = "course_offerings"

    offering_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    course_id = Column(Integer, ForeignKey("course_catalog.course_id", ondelete="CASCADE"), nullable=False, index=True)
    academic_session_id = Column(Integer, ForeignKey("academic_sessions.session_id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.dept_id", ondelete="SET NULL"), nullable=True, index=True)

    section = Column(String(32), nullable=False, index=True, doc="Section code (e.g., A, B, L01)")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    catalog_entry = relationship("CourseCatalog", back_populates="offerings")
    academic_session = relationship("AcademicSession", back_populates="course_offerings")
    department = relationship("Department", back_populates="course_offerings")

    assignments = relationship("Assignment", back_populates="course_offering", cascade="all, delete-orphan")
    associate_teachers = relationship("AssociateTeacher", back_populates="course_offering", cascade="all, delete-orphan")
    professors = relationship("Professor", back_populates="course_offering", cascade="all, delete-orphan")
    section_groups = relationship("SectionGroup", back_populates="course_offering", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course_offering", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<CourseOffering(offering_id={self.offering_id}, section='{self.section}')>"