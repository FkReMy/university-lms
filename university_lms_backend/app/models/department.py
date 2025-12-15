"""
Department Model (Production)
-----------------------------
Represents a university academic department, organizes courses and staff.

- No sample/demo/test fields or logic.
- Unified audit fields and department/course relationships.
"""

from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Department(Base):
    """
    Database model for academic departments (e.g., Computer Science).
    """
    __tablename__ = "departments"

    dept_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(128), nullable=False, unique=True)
    code = Column(String(16), nullable=False, unique=True, index=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    course_catalog = relationship("CourseCatalog", back_populates="department")
    course_offerings = relationship("CourseOffering", back_populates="department")

    def __repr__(self):
        return f"<Department(dept_id={self.dept_id}, code='{self.code}', name='{self.name}')>"