"""
Notification Repository (Production)
------------------------------------
Handles CRUD and business queries for notifications sent to users (announcements, alerts, reminders, etc.).

- No sample, demo, or test code.
- Only global models and consistent SQLAlchemy session patterns.
"""

from sqlalchemy.orm import Session
from app.models.notification import Notification

class NotificationRepository:
    """
    Repository for Notification operations and business queries.
    """

    @staticmethod
    def create(db: Session, user_id: int, title: str, message: str, notification_type: str = None, is_read: bool = False):
        """
        Create and persist a new notification for a user.
        """
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            is_read=is_read,
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def get_by_id(db: Session, notification_id: int):
        """
        Get a notification by its primary key.
        """
        return db.query(Notification).filter(Notification.notification_id == notification_id).first()

    @staticmethod
    def list_by_user(db: Session, user_id: int):
        """
        List all notifications for a given user.
        """
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    @staticmethod
    def list_unread_by_user(db: Session, user_id: int):
        """
        List all unread notifications for a given user.
        """
        return db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).order_by(Notification.created_at.desc()).all()

    @staticmethod
    def mark_as_read(db: Session, notification_id: int):
        """
        Marks a notification as read.
        """
        notification = db.query(Notification).filter(Notification.notification_id == notification_id).first()
        if not notification:
            return None
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def delete(db: Session, notification_id: int):
        """
        Delete a notification by its ID.
        """
        notification = db.query(Notification).filter(Notification.notification_id == notification_id).first()
        if not notification:
            return False
        db.delete(notification)
        db.commit()
        return True