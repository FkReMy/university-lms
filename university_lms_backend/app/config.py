"""
University LMS Backend - Configuration Loader (Production)
----------------------------------------------------------
Centralizes all application and infrastructure settings.

- Loads values from environment variables and .env files using Pydantic for validation.
- Provides a single global config object, used throughout app for consistency.
- Never hardcodes secrets; all are sourced securely.
"""

import os
from typing import List, Optional, Union
from functools import lru_cache

from pydantic_settings import BaseSettings
from pydantic import Field, AnyHttpUrl, field_validator

class Settings(BaseSettings):
    # Core Project and Environment
    ENVIRONMENT: str = Field("production", description="App environment (production/development/test)")
    PROJECT_NAME: str = Field("University LMS Backend", description="Project display name")
    VERSION: str = Field("1.0.0", description="Release version")

    # Database
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: str

    # JWT/Auth
    JWT_SECRET_KEY: str
    JWT_ACCESS_TOKEN_EXPIRES_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRES_MINUTES: int = 43200
    JWT_ALGORITHM: str = "HS256"

    # Argon2 Password Hasher settings
    ARGON2_TIME_COST: int = 3
    ARGON2_MEMORY_COST: int = 65536
    ARGON2_PARALLELISM: int = 4

    # File Uploads
    UPLOADS_PATH: str = "/uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    ALLOWED_UPLOAD_MIME_TYPES: str = "pdf,docx,zip,txt,png,jpg"

    # Email (notifications, password reset)
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_HOST_USER: str
    EMAIL_HOST_PASSWORD: str
    EMAIL_FROM: str
    EMAIL_TLS: bool = True

    # Redis (for caching/future features)
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_URL: str = "redis://redis:6379/0"

    # Security / CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = "http://localhost:5173"
    ALLOWED_METHODS: str = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    ALLOWED_HEADERS: str = "Authorization,Content-Type"

    # Logging
    LOG_LEVEL: str = "INFO"

    # Feature Flags & Misc
    # SENTRY_DSN: Optional[str] = None
    # ENABLE_AI_GRADING: bool = False
    # ENABLE_ANALYTICS: bool = False

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_origins(cls, v):
        # Accept comma-separated string, return as list (for CORS)
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @property
    def uploads_path_abs(self) -> str:
        """Return the absolute uploads directory path."""
        path = self.UPLOADS_PATH
        if not os.path.isabs(path):
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            return os.path.join(base_dir, path)
        return path

    @property
    def allowed_upload_types(self) -> List[str]:
        """List of allowed upload mime/file types."""
        return [typ.strip() for typ in self.ALLOWED_UPLOAD_MIME_TYPES.split(",")]

@lru_cache()
def get_settings() -> Settings:
    """
    Returns a singleton instance of Settings loaded from env.
    Use import and call get_settings() anywhere in the app.
    """
    return Settings()