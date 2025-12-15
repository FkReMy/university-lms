"""
Notification Service (Production)
---------------------------------
Service layer for managing Notification entities, providing CRUD operations
and business logic for notifications within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and system-wide conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.notification import Notification
from app.schemas.notification import (
    NotificationCreate,
    NotificationUpdate,
)
from app.schemas.notification import Notification as NotificationSchema

class NotificationService:
    """
    Handles CRUD and business operations for notifications.
    """

    @staticmethod
    def get_by_id(db: Session, notification_id: int) -> Optional[NotificationSchema]:
        """
        Retrieve a notification by its unique identifier.
        """
        notif_obj = db.query(Notification).filter(Notification.notification_id == notification_id).first()
        return NotificationSchema.from_orm(notif_obj) if notif_obj else None

    @staticmethod
    def get_by_user_id(db: Session, user_id: int) -> List[NotificationSchema]:
        """
        Retrieve all notifications for a specific user.
        """
        notifications = db.query(Notification).filter(Notification.user_id == user_id).all()
        return [NotificationSchema.from_orm(n) for n in notifications]

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[NotificationSchema]:
        """
        Retrieve a paginated list of all notifications.
        """
        notifications = db.query(Notification).offset(skip).limit(limit).all()
        return [NotificationSchema.from_orm(n) for n in notifications]

    @staticmethod
    def create(db: Session, notif_in: NotificationCreate) -> NotificationSchema:
        """
        Create and persist a new notification record.
        """
        notif_obj = Notification(**notif_in.dict())
        db.add(notif_obj)
        db.commit()
        db.refresh(notif_obj)
        return NotificationSchema.from_orm(notif_obj)

    @staticmethod
    def update(
        db: Session,
        notification_id: int,
        notif_in: NotificationUpdate
    ) -> Optional[NotificationSchema]:
        """
        Update an existing notification with provided fields.
        """
        notif_obj = db.query(Notification).filter(Notification.notification_id == notification_id).first()
        if not notif_obj:
            return None
        for field, value in notif_in.dict(exclude_unset=True).items():
            setattr(notif_obj, field, value)
        db.commit()
        db.refresh(notif_obj)
        return NotificationSchema.from_orm(notif_obj)

    @staticmethod
    def delete(db: Session, notification_id: int) -> bool:
        """
        Delete a notification by its ID. Returns True if deleted, False if not found.
        """
        notif_obj = db.query(Notification).filter(Notification.notification_id == notification_id).first()
        if not notif_obj:
            return False
        db.delete(notif_obj)
        db.commit()
        return True