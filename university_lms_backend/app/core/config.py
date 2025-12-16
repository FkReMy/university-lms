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

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    # App metadata
    PROJECT_NAME: str = Field(default="University LMS")
    VERSION: str = Field(default="1.0.0")
    
    # Security & JWT config
    SECRET_KEY: str = Field(default="INSECURE_DEV_SECRET_CHANGE_IN_PRODUCTION")
    ALGORITHM: str = Field(default="HS256", alias="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60)
    REFRESH_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24 * 7)  # 1 week

    # Database config
    SQLALCHEMY_DATABASE_URI: str = Field(
        default="sqlite:///./test.db",
        alias="DATABASE_URL"
    )

    # Allowed CORS origins
    CORS_ORIGINS: str = Field(default="*")
    ALLOWED_ORIGINS: str = Field(default="http://localhost:5173,http://localhost:3000")
    ALLOWED_METHODS: str = Field(default="GET,POST,PUT,PATCH,DELETE,OPTIONS")
    ALLOWED_HEADERS: str = Field(default="Authorization,Content-Type")

    # File upload limits, in bytes
    MAX_UPLOAD_SIZE: int = Field(default=10485760)  # 10MB

    # Email/SMS notification (example keys, expand as needed)
    EMAIL_FROM: str = Field(default="noreply@example.com")
    EMAIL_SERVER: str = Field(default="localhost")
    EMAIL_PORT: int = Field(default=587)
    EMAIL_USERNAME: str = Field(default="")
    EMAIL_PASSWORD: str = Field(default="")

    # Environment marker for audit/tracing
    ENVIRONMENT: str = Field(default="production")

# Singleton instance holder for the whole project
@lru_cache()
def get_settings() -> Settings:
    """
    Cached (singleton) production settings instance for dependency injection.
    """
    return Settings()

# Usage: from app.core.config import settings
settings = get_settings()