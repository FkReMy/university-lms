"""
Global Configuration (Production)
---------------------------------
Application-wide configuration settings and environment variable helpers
for the University LMS backend.

This module centralizes all key settings (security, DB, CORS, etc).
Absolutely NO demo/sample/test logic here.

- Use only in production-ready code.
- All required settings must be defined and documented.
"""

import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )
    
    # App metadata
    PROJECT_NAME: str = "University LMS"
    VERSION: str = "1.0.0"
    
    # Security & JWT config
    SECRET_KEY: str = "INSECURE_DEV_SECRET_CHANGE_IN_PRODUCTION"
    JWT_SECRET_KEY: Optional[str] = None  # Alias for SECRET_KEY
    ALGORITHM: str = "HS256"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_ACCESS_TOKEN_EXPIRES_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    JWT_REFRESH_TOKEN_EXPIRES_MINUTES: int = 60 * 24 * 7

    # Database config
    DATABASE_URL: str = "sqlite:///./test.db"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None  # Will use DATABASE_URL if not set

    # Allowed CORS origins
    CORS_ORIGINS: str = "*"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    ALLOWED_METHODS: str = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    ALLOWED_HEADERS: str = "Authorization,Content-Type"

    # File upload limits, in bytes
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB

    # Email/SMS notification settings
    EMAIL_HOST: str = "localhost"
    EMAIL_PORT: int = 587
    EMAIL_HOST_USER: str = ""
    EMAIL_HOST_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@example.com"
    EMAIL_TLS: bool = True

    # Environment marker for audit/tracing
    ENVIRONMENT: str = "production"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set SQLALCHEMY_DATABASE_URI from DATABASE_URL if not set
        if not self.SQLALCHEMY_DATABASE_URI:
            self.SQLALCHEMY_DATABASE_URI = self.DATABASE_URL
        # Use JWT_SECRET_KEY if SECRET_KEY not explicitly set
        if self.JWT_SECRET_KEY and self.SECRET_KEY == "INSECURE_DEV_SECRET_CHANGE_IN_PRODUCTION":
            self.SECRET_KEY = self.JWT_SECRET_KEY

# Singleton instance holder for the whole project
@lru_cache()
def get_settings() -> Settings:
    """
    Cached (singleton) production settings instance for dependency injection.
    """
    return Settings()

# Usage: from app.core.config import settings
settings = get_settings()