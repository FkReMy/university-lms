"""
QuizFile Model (Production)
---------------------------
Represents a file attachment for a quiz (such as supplementary material, images, files).

- No sample, demo, or test fields.
- Unified with global user, quiz, and storage components.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship

from app.models.base import Base

class QuizFile(Base):
    """
    Database model for files attached to a quiz (for reference, description, etc.).
    """
    __tablename__ = "quiz_files"

    file_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.quiz_id", ondelete="CASCADE"), nullable=False, index=True)

    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False, doc="Cloud/local storage path or URL")
    content_type = Column(String(128), nullable=False)
    uploaded_by_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)

    uploaded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    quiz = relationship("Quiz", back_populates="files")
    uploaded_by = relationship("User")

    def __repr__(self):
        return (
            f"<QuizFile(file_id={self.file_id}, quiz_id={self.quiz_id}, filename='{self.filename}')>"
        )