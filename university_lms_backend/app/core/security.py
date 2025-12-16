"""
Security Utilities (Production)
-------------------------------
Centralized, production-grade security helpers for the University LMS backend.

- Handles file upload validation, password hashing, and other security-related helpers.
- Only uses global, production-ready components.
- No samples, demos, or legacy/test logic.
"""

from fastapi import HTTPException, status, UploadFile
from typing import List
from datetime import timedelta
import secrets
import string
import re

ALLOWED_EXTENSIONS: List[str] = [
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
    ".txt", ".csv", ".jpg", ".jpeg", ".png", ".gif", ".zip",
]
MAX_FILENAME_LENGTH: int = 128
MAX_UPLOAD_SIZE: int = 10485760  # 10MB default. (Override from config for global setting as needed.)

def validate_upload_file(file: UploadFile, max_size: int = MAX_UPLOAD_SIZE):
    """
    Production-safe validation for file uploads.
    Checks file extension, name length, and (if possible) content size.
    Raises HTTP 400 on violation.
    """
    filename = file.filename
    if not filename or len(filename) > MAX_FILENAME_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file name or length.",
        )

    if not any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Content length validation (streamed uploads may not always have .spooled size)
    if hasattr(file.file, "fileno"):
        try:
            pos = file.file.tell()
            file.file.seek(0, 2)  # Go to end of file
            size = file.file.tell()
            file.file.seek(pos)
            if size > max_size:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="File is too large.",
                )
        except Exception:
            pass  # Fallback for non-seekable streams
    elif hasattr(file.file, "getbuffer"):
        size = len(file.file.getbuffer())
        if size > max_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File is too large.",
            )

def hash_password(password: str) -> str:
    """
    Securely hashes a password for storage. Uses PBKDF2 by default.
    """
    import hashlib
    import os
    salt = os.urandom(16)
    hash_val = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt.hex() + ":" + hash_val.hex()

def get_password_hash(password: str) -> str:
    """
    Alias for hash_password for consistency with common naming conventions.
    """
    return hash_password(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plaintext password against a stored hash.
    """
    import hashlib
    salt, hash_val = hashed_password.split(":")
    test_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), bytes.fromhex(salt), 100000)
    return test_hash.hex() == hash_val

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Create a JWT access token with optional expiration.
    """
    from jose import jwt
    from datetime import datetime, timedelta
    from app.core.config import settings
    
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def generate_secure_token(length: int = 40) -> str:
    """
    Generates a cryptographically-secure random token.
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def validate_password_strength(password: str):
    """
    Validates production password strength policy. Raises 400 if weak.
    """
    length_ok = len(password) >= 8
    upper = re.search(r'[A-Z]', password)
    lower = re.search(r'[a-z]', password)
    digit = re.search(r'\d', password)
    symbol = re.search(r'[^\w\s]', password)
    if not (length_ok and upper and lower and digit and symbol):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 chars long, and include upper, lower, digit, and symbol.",
        )