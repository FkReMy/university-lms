"""
Pytest Configuration for University LMS Backend
----------------------------------------------
This file provides fixtures and configurations for pytest to ensure
consistent, isolated, and reliable tests across the backend service.

- No sample, demo, or test-specific mockups; configured for production-level integration testing.
- References and uses global app factories and shared components for unified testing experience.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Base
from app.core.database import get_db
from app.main import create_app

# Configure testing database URL - must be an isolated, ephemeral DB for tests.
TEST_DATABASE_URL = "sqlite:///./test.db"  # Adjust as needed for CI/CD or better isolation

# Engine and session creation for test DB.
engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the database schema for testing purposes
@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """
    Set up the test database for the session.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after tests if needed
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """
    Provides a clean database session for each test function,
    rolling back changes afterwards to maintain isolation.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    """
    Provides a test client that overrides the database dependency
    to use the test session.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app = create_app()
    app.dependency_overrides[get_db] = override_get_db

    from fastapi.testclient import TestClient
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()