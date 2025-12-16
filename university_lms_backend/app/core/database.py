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
from functools import lru_cache
from app.config import get_settings

# Import all models to ensure relationships are properly configured
# This must happen before any queries
try:
    import app.models.__all_models__  # noqa: F401
except ImportError:
    # If the __all_models__ file doesn't exist, fallback to individual imports
    pass

from app.models.base import Base

@lru_cache(maxsize=1)
def get_engine():
    """Get or create the database engine (lazy initialization, thread-safe singleton)."""
    settings = get_settings()
    return create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using them
        pool_size=10,
        max_overflow=20
    )

@lru_cache(maxsize=1)
def get_session_local():
    """Get or create the SessionLocal factory (lazy initialization, thread-safe singleton)."""
    engine = get_engine()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)

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
    
    def __repr__(self):
        """Return representation of the underlying engine."""
        return repr(get_engine())
    
    def __str__(self):
        """Return string representation of the underlying engine."""
        return str(get_engine())

class _LazySessionLocal:
    """Lazy proxy for SessionLocal that initializes on first access."""
    def __call__(self, *args, **kwargs):
        """Create a new database session (backward compatibility wrapper)."""
        return get_session_local()(*args, **kwargs)
    
    def __getattr__(self, name):
        """Forward attribute access to the actual SessionLocal factory."""
        return getattr(get_session_local(), name)
    
    def __repr__(self):
        """Return representation of the underlying SessionLocal factory."""
        return repr(get_session_local())
    
    def __str__(self):
        """Return string representation of the underlying SessionLocal factory."""
        return str(get_session_local())

engine = _LazyEngine()
SessionLocal = _LazySessionLocal()
