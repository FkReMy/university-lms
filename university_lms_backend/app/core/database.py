"""
Database Configuration (Production)
----------------------------------
Provides database session management and connection pooling for the University LMS backend.

- Uses SQLAlchemy for ORM
- Provides get_db() generator for dependency injection
- Configured for production use with proper connection pooling
- Uses lazy initialization to avoid loading settings at import time
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.config import get_settings
from app.models.base import Base

# Global variables for engine and session factory (initialized lazily)
_engine = None
_SessionLocal = None

def get_engine():
    """Get or create the database engine (lazy initialization)."""
    global _engine
    if _engine is None:
        settings = get_settings()
        _engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,  # Verify connections before using them
            pool_size=10,
            max_overflow=20
        )
    return _engine

def get_session_local():
    """Get or create the SessionLocal factory (lazy initialization)."""
    global _SessionLocal
    if _SessionLocal is None:
        engine = get_engine()
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return _SessionLocal

def get_db() -> Generator[Session, None, None]:
    """
    Database session generator for dependency injection.
    
    Usage:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            # Use db here
            pass
    """
    SessionLocal = get_session_local()
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
    engine = get_engine()
    Base.metadata.create_all(bind=engine)

# Backward compatibility: Provide engine and SessionLocal as module attributes
# These will be accessed lazily when actually used
class _LazyEngine:
    """Lazy proxy for engine that initializes on first access."""
    def __getattr__(self, name):
        """Forward attribute access to the actual engine instance."""
        return getattr(get_engine(), name)

class _LazySessionLocal:
    """Lazy proxy for SessionLocal that initializes on first access."""
    def __call__(self, *args, **kwargs):
        """Create a new database session (backward compatibility wrapper)."""
        return get_session_local()(*args, **kwargs)
    
    def __getattr__(self, name):
        """Forward attribute access to the actual SessionLocal factory."""
        return getattr(get_session_local(), name)

engine = _LazyEngine()
SessionLocal = _LazySessionLocal()
