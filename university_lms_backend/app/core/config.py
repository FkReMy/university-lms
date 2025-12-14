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
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    # Security & JWT config
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24 * 7, env="REFRESH_TOKEN_EXPIRE_MINUTES")  # 1 week

    # Database config
    SQLALCHEMY_DATABASE_URI: str = Field(..., env="DATABASE_URL")

    # Allowed CORS origins
    CORS_ORIGINS: str = Field(default="*", env="CORS_ORIGINS")

    # File upload limits, in bytes
    MAX_UPLOAD_SIZE: int = Field(default=10485760, env="MAX_UPLOAD_SIZE")  # 10MB

    # Email/SMS notification (example keys, expand as needed)
    EMAIL_FROM: str = Field(..., env="EMAIL_FROM")
    EMAIL_SERVER: str = Field(..., env="EMAIL_SERVER")
    EMAIL_PORT: int = Field(default=587, env="EMAIL_PORT")
    EMAIL_USERNAME: str = Field(..., env="EMAIL_USERNAME")
    EMAIL_PASSWORD: str = Field(..., env="EMAIL_PASSWORD")

    # Environment marker for audit/tracing
    ENVIRONMENT: str = Field(default="production", env="ENVIRONMENT")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Singleton instance holder for the whole project
@lru_cache()
def get_settings() -> Settings:
    """
    Cached (singleton) production settings instance for dependency injection.
    """
    return Settings()

# Usage: from app.core.config import settings
settings = get_settings()