"""
UploadedFile Model (Production)
-------------------------------
Represents a file uploaded by a user (student, faculty, or staff) in the LMS.
Supports general file storage for assignments, resources, profile images, etc.

- No sample, demo, or test fields.
- Fully unified with global user and upload/ref logic.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func, Text
from sqlalchemy.orm import relationship

from app.models.base import Base

class UploadedFile(Base):
    """
    Database model for a file uploaded by a user.
    Supports general user content (assignments, course materials, avatars, etc.).
    """
    __tablename__ = "uploaded_files"

    file_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False, doc="Absolute or storage location (cloud/local)")
    file_type = Column(String(128), nullable=True, doc="Optional MIME type")
    description = Column(Text, nullable=True, doc="Optional description or purpose for this file")
    uploaded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="uploaded_files")

    def __repr__(self):
        return (
            f"<UploadedFile(file_id={self.file_id}, user_id={self.user_id}, filename='{self.filename}')>"
        )