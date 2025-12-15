"""
CourseCatalog Model (Production)
--------------------------------
Represents globally cataloged university courses (not calendar offerings).

- No sample/demo/test fields or logic.
- Connects with departments, and is used to create calendar-specific offerings.
- Unified with audit fields and relationships.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class CourseCatalog(Base):
    """
    Database model for catalog courses (e.g., CS101 - Intro to Programming).
    This holds canonical catalog entries, not per-term/section offerings.
    """
    __tablename__ = "course_catalog"

    course_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    course_code = Column(String(32), nullable=False, unique=True, index=True)
    course_name = Column(String(256), nullable=False)
    credits = Column(Integer, nullable=False)
    dept_id = Column(Integer, ForeignKey("departments.dept_id", ondelete="SET NULL"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    department = relationship("Department", back_populates="course_catalog")
    offerings = relationship("CourseOffering", back_populates="catalog_entry")

    def __repr__(self):
        return f"<CourseCatalog(course_id={self.course_id}, course_code='{self.course_code}')>"