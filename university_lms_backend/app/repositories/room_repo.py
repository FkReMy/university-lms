"""
Room Repository (Production)
----------------------------
Handles CRUD and query operations for classroom or exam room entities.

- No sample, demo, or test code.
- Consistent use of global SQLAlchemy session and models.
"""

from sqlalchemy.orm import Session
from app.models.room import Room

class RoomRepository:
    """
    Repository for handling rooms used in scheduling and assignments.
    """

    @staticmethod
    def create(db: Session, name: str, code: str = None, capacity: int = None, type: str = None, location: str = None, description: str = None):
        """
        Create and persist a new room.
        """
        room = Room(
            name=name,
            code=code,
            capacity=capacity,
            type=type,
            location=location,
            description=description
        )
        db.add(room)
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def get_by_id(db: Session, room_id: int):
        """
        Retrieve a room by its primary key.
        """
        return db.query(Room).filter(Room.room_id == room_id).first()

    @staticmethod
    def get_by_code(db: Session, code: str):
        """
        Retrieve a room by its code.
        """
        return db.query(Room).filter(Room.code == code).first()

    @staticmethod
    def list_all(db: Session):
        """
        List all rooms in the system.
        """
        return db.query(Room).all()

    @staticmethod
    def update(db: Session, room_id: int, **kwargs):
        """
        Update the attributes of an existing room.
        """
        room = db.query(Room).filter(Room.room_id == room_id).first()
        if not room:
            return None
        for key, value in kwargs.items():
            setattr(room, key, value)
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def delete(db: Session, room_id: int):
        """
        Delete a room by its primary key.
        """
        room = db.query(Room).filter(Room.room_id == room_id).first()
        if not room:
            return False
        db.delete(room)
        db.commit()
        return True