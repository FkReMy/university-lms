"""
CourseCatalog Service (Production)
----------------------------------
Service layer for managing CourseCatalog entities in the LMS, handling all CRUD operations
and straight-forward business logic for catalog records.

- No sample, demo, or test code.
- Utilizes global models, schemas, and unified system conventions.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.course_catalog import CourseCatalog
from app.schemas.course_catalog import (
    CourseCatalogCreate,
    CourseCatalogUpdate,
)
from app.schemas.course_catalog import CourseCatalog as CourseCatalogSchema

class CourseCatalogService:
    """
    Manages CRUD operations for course catalog entries.
    """

    @staticmethod
    def get_by_id(db: Session, course_catalog_id: int) -> Optional[CourseCatalogSchema]:
        """
        Retrieve a course catalog item by its unique identifier.
        """
        catalog_obj = db.query(CourseCatalog).filter(CourseCatalog.course_catalog_id == course_catalog_id).first()
        return CourseCatalogSchema.from_orm(catalog_obj) if catalog_obj else None

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[CourseCatalogSchema]:
        """
        Retrieve all course catalog items with pagination.
        """
        catalogs = db.query(CourseCatalog).offset(skip).limit(limit).all()
        return [CourseCatalogSchema.from_orm(c) for c in catalogs]

    @staticmethod
    def create(db: Session, catalog_in: CourseCatalogCreate) -> CourseCatalogSchema:
        """
        Create and persist a new course catalog record.
        """
        catalog_obj = CourseCatalog(**catalog_in.dict())
        db.add(catalog_obj)
        db.commit()
        db.refresh(catalog_obj)
        return CourseCatalogSchema.from_orm(catalog_obj)

    @staticmethod
    def update(
        db: Session,
        course_catalog_id: int,
        catalog_in: CourseCatalogUpdate
    ) -> Optional[CourseCatalogSchema]:
        """
        Update an existing course catalog entry.
        """
        catalog_obj = db.query(CourseCatalog).filter(CourseCatalog.course_catalog_id == course_catalog_id).first()
        if not catalog_obj:
            return None
        for field, value in catalog_in.dict(exclude_unset=True).items():
            setattr(catalog_obj, field, value)
        db.commit()
        db.refresh(catalog_obj)
        return CourseCatalogSchema.from_orm(catalog_obj)

    @staticmethod
    def delete(db: Session, course_catalog_id: int) -> bool:
        """
        Delete a course catalog entry by its ID. Returns True if deleted, False if not found.
        """
        catalog_obj = db.query(CourseCatalog).filter(CourseCatalog.course_catalog_id == course_catalog_id).first()
        if not catalog_obj:
            return False
        db.delete(catalog_obj)
        db.commit()
        return True