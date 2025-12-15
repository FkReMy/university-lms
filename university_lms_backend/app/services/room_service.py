"""
Room Service (Production)
-------------------------
Service layer for managing Room entities, encapsulating CRUD operations and
business logic for classroom or lab rooms within the LMS.

- No sample, demo, or test code.
- Utilizes global models, schemas, and project-wide conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.room import Room
from app.schemas.room import (
    RoomCreate,
    RoomUpdate,
)
from app.schemas.room import Room as RoomSchema

class RoomService:
    """
    Handles CRUD and business operations for room records.
    """

    @staticmethod
    def get_by_id(db: Session, room_id: int) -> Optional[RoomSchema]:
        """
        Retrieve a room by its unique identifier.
        """
        room_obj = db.query(Room).filter(Room.room_id == room_id).first()
        return RoomSchema.from_orm(room_obj) if room_obj else None

    @staticmethod
    def get_by_name(db: Session, name: str) -> Optional[RoomSchema]:
        """
        Retrieve a room by its unique name.
        """
        room_obj = db.query(Room).filter(Room.name == name).first()
        return RoomSchema.from_orm(room_obj) if room_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[RoomSchema]:
        """
        Retrieve a paginated list of all rooms.
        """
        rooms = db.query(Room).offset(skip).limit(limit).all()
        return [RoomSchema.from_orm(r) for r in rooms]

    @staticmethod
    def create(db: Session, room_in: RoomCreate) -> RoomSchema:
        """
        Create and persist a new room record.
        """
        room_obj = Room(**room_in.dict())
        db.add(room_obj)
        db.commit()
        db.refresh(room_obj)
        return RoomSchema.from_orm(room_obj)

    @staticmethod
    def update(
        db: Session,
        room_id: int,
        room_in: RoomUpdate
    ) -> Optional[RoomSchema]:
        """
        Update an existing room with provided fields.
        """
        room_obj = db.query(Room).filter(Room.room_id == room_id).first()
        if not room_obj:
            return None
        for field, value in room_in.dict(exclude_unset=True).items():
            setattr(room_obj, field, value)
        db.commit()
        db.refresh(room_obj)
        return RoomSchema.from_orm(room_obj)

    @staticmethod
    def delete(db: Session, room_id: int) -> bool:
        """
        Delete a room by its ID. Returns True if deleted, False if not found.
        """
        room_obj = db.query(Room).filter(Room.room_id == room_id).first()
        if not room_obj:
            return False
        db.delete(room_obj)
        db.commit()
        return True