"""
Notification Model (Production)
-------------------------------
Represents a notification sent to a user (system, assignment, feedback, etc.) 

- No sample, demo, or test fields.
- Fully integrated with the global user system.
- Unified audit and delivery fields.
"""

from sqlalchemy import Column, Integer, ForeignKey, String, Boolean, DateTime, func, Text
from sqlalchemy.orm import relationship

from app.models.base import Base

class Notification(Base):
    """
    Database model for notifications sent to users for LMS events 
    (assignment, grading, system update, custom message).
    """
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    notification_type = Column(String(32), nullable=False, doc="E.g., system, assignment, feedback, etc.")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")

    def __repr__(self):
        return (
            f"<Notification(notification_id={self.notification_id}, user_id={self.user_id}, type={self.notification_type})>"
        )