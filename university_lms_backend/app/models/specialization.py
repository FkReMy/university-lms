"""
Specialization Model (Production)
---------------------------------
Represents a major, minor, or specialization a student can declare (e.g., Computer Science, Data Analytics).

- No sample, demo, or test fields or logic.
- Fully unified with global department and user models.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class Specialization(Base):
    """
    Database model for an academic specialization/major/minor.
    Linked to department and students.
    """
    __tablename__ = "specializations"

    specialization_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(128), nullable=False, unique=True, index=True, doc="Name, e.g., 'Data Analytics'")
    code = Column(String(32), nullable=False, unique=True, index=True, doc="Short code, e.g., 'DA'")
    dept_id = Column(Integer, ForeignKey("departments.dept_id", ondelete="SET NULL"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    department = relationship("Department")
    students = relationship("User", back_populates="specialization")

    def __repr__(self):
        return (
            f"<Specialization(specialization_id={self.specialization_id}, code='{self.code}', name='{self.name}')>"
        )