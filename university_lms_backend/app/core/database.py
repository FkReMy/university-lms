"""
Database Configuration (Production)
----------------------------------
Provides database session management and connection pooling for the University LMS backend.

- Uses SQLAlchemy for ORM
- Provides get_db() generator for dependency injection
- Configured for production use with proper connection pooling
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import get_settings
from app.models.base import Base

settings = get_settings()

# Create database engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=10,
    max_overflow=20
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Session:
    """
    Database session generator for dependency injection.
    
    Usage:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            # Use db here
            pass
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Initialize database tables.
    Creates all tables defined in Base.metadata.
    """
    Base.metadata.create_all(bind=engine)
