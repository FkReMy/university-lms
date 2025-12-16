"""
Auth Schema (Production)
------------------------
Pydantic schemas for authentication endpoints including login, token refresh,
password management, and related authentication flows.

- No sample, demo, or test code.
- Follows global schema conventions for a unified and maintainable architecture.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class AuthLoginRequest(BaseModel):
    """Schema for login request with username/email and password"""
    username: str = Field(..., description="Username or email for login")
    password: str = Field(..., description="User password")


class AuthTokenResponse(BaseModel):
    """Schema for successful authentication response with tokens"""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: Optional[str] = Field(None, description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    user_id: Optional[int] = Field(None, description="Authenticated user ID")
    username: Optional[str] = Field(None, description="Authenticated username")
    role: Optional[str] = Field(None, description="User role")


class AuthRefreshRequest(BaseModel):
    """Schema for token refresh request"""
    refresh_token: str = Field(..., description="Valid refresh token")


class AuthRefreshResponse(BaseModel):
    """Schema for token refresh response"""
    access_token: str = Field(..., description="New JWT access token")
    token_type: str = Field(default="bearer", description="Token type")


class AuthPasswordChangeRequest(BaseModel):
    """Schema for password change request (authenticated user)"""
    old_password: str = Field(..., description="Current password for verification")
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")


class AuthPasswordResetRequest(BaseModel):
    """Schema for password reset request (forgot password)"""
    email: EmailStr = Field(..., description="Email address for password reset")


class AuthPasswordResetConfirmRequest(BaseModel):
    """Schema for password reset confirmation with token"""
    token: str = Field(..., description="Password reset token from email")
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")


class AdminPasswordResetRequest(BaseModel):
    """Schema for admin to reset a user's password"""
    new_password: str = Field(..., min_length=8, description="New password for the user (minimum 8 characters)")

