"""
CourseCatalog Repository (Production)
-------------------------------------
Handles database operations for the CourseCatalog model, representing the university's official offerings.

- No sample, demo, or test logic.
- All interactions use global SQLAlchemy models and session patterns.
"""

from sqlalchemy.orm import Session
from app.models.course_catalog import CourseCatalog

class CourseCatalogRepository:
    """
    Repository for accessing and modifying CourseCatalog entries.
    """

    @staticmethod
    def create(db: Session, code: str, title: str, description: str = None, credits: int = 0, department_id: int = None):
        """
        Create and persist a new course catalog entry.
        """
        catalog = CourseCatalog(
            code=code,
            title=title,
            description=description,
            credits=credits,
            department_id=department_id,
        )
        db.add(catalog)
        db.commit()
        db.refresh(catalog)
        return catalog

    @staticmethod
    def get_by_id(db: Session, catalog_id: int):
        """
        Retrieve a course catalog record by its primary key.
        """
        return db.query(CourseCatalog).filter(CourseCatalog.catalog_id == catalog_id).first()

    @staticmethod
    def get_by_code(db: Session, code: str):
        """
        Retrieve a course catalog record by official course code.
        """
        return db.query(CourseCatalog).filter(CourseCatalog.code == code).first()

    @staticmethod
    def list_by_department(db: Session, department_id: int):
        """
        List all course catalog entries for a given department.
        """
        return db.query(CourseCatalog).filter(CourseCatalog.department_id == department_id).all()

    @staticmethod
    def list_all(db: Session):
        """
        List all courses in the university's course catalog.
        """
        return db.query(CourseCatalog).all()

    @staticmethod
    def update(db: Session, catalog_id: int, **kwargs):
        """
        Update a course catalog entry with optional fields (code, title, description, credits, department_id).
        """
        catalog = db.query(CourseCatalog).filter(CourseCatalog.catalog_id == catalog_id).first()
        if not catalog:
            return None
        for key, value in kwargs.items():
            setattr(catalog, key, value)
        db.commit()
        db.refresh(catalog)
        return catalog

    @staticmethod
    def delete(db: Session, catalog_id: int):
        """
        Permanently delete a course catalog entry.
        """
        catalog = db.query(CourseCatalog).filter(CourseCatalog.catalog_id == catalog_id).first()
        if not catalog:
            return False
        db.delete(catalog)
        db.commit()
        return True