"""
Centralized Logging Configuration (Production)
----------------------------------------------
Production-grade, unified logging setup for University LMS backend.

- All modules should import and use this configuration.
- Logging settings are consistent across the platform.
- No sample/demo configuration present; only production-validated logic.
"""

import logging
import sys

def setup_logging():
    """
    Configures the standard logger for application-wide, production-safe usage.
    Log format includes ISO time, level, module, and message.
    """
    log_level = "INFO"
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z",
        stream=sys.stdout,
    )
    # Optional: silence overly verbose loggers from dependencies if needed
    logging.getLogger("uvicorn.error").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

def get_logger(name: str) -> logging.Logger:
    """
    Gets a logger with the unified production logging configuration.
    Usage:
        logger = get_logger(__name__)
    """
    return logging.getLogger(name)

# Call setup_logging once during FastAPI app startup
setup_logging()