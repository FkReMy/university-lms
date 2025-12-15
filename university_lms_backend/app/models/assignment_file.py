"""
AssignmentFile Model (Production)
---------------------------------
Represents immutable, uploaded files linked to assignments (description, solution, etc)
for the University LMS.

- No sample/demo/test fields.
- Uses global fields for file management and audit.
- File paths stored for external or local storage.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class AssignmentFile(Base):
    """
    Database model for files uploaded and attached to an assignment (for students or teachers).
    Immutable, does not get edited - only added or removed.
    """
    __tablename__ = "assignment_files"

    file_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.assignment_id", ondelete="CASCADE"), nullable=False, index=True)

    filename = Column(String(255), nullable=False)
    content_type = Column(String(128), nullable=False)
    file_path = Column(String(512), nullable=False, doc="Physical or cloud storage path/URL")

    uploaded_by_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"))
    uploaded_by = relationship("User", back_populates="assignment_files")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    assignment = relationship("Assignment", back_populates="files")

    def __repr__(self):
        return f"<AssignmentFile(file_id={self.file_id}, filename='{self.filename}')>"