"""
User Schema (Production)
------------------------
Pydantic schemas for the User model, governing validation and serialization of user records for authentication, profile, and role management.

- No sample, demo, or test code.
- Follows global schema conventions for a unified and maintainable architecture.
- Status field matches underlying database: only "active" (is_active=True) and "inactive" (is_active=False) are represented.
- role: included and normalized (may be string, object, or role_id for frontend flexibility).
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Union
from datetime import datetime

class UserBase(BaseModel):
    """
    Shared schema for user creation, update, and read.
    Status: Only "active" or "inactive" supported, mapped to is_active bool in DB.
    Role: string, id, or minimal object allowed; always present for frontend consumption.
    """
    username: str = Field(..., description="Globally unique username")
    email: EmailStr = Field(..., description="User email address (must be unique)")
    full_name: Optional[str] = Field(None, description="User's full name")
    phone: Optional[str] = Field(None, description="User's contact phone number")
    status: Optional[str] = Field(
        "active",
        description="Account status; only 'active' or 'inactive' supported for compatibility with database"
    )
    profile_image_path: Optional[str] = Field(None, description="Path to profile image file")
    role: Optional[Union[str, dict, int]] = Field(
        None, description="User's role - typically a string, but may be an object or id for robust integration."
    )

    @staticmethod
    def from_model(user_obj):
        """
        Utility to create schema from SQLAlchemy model instance,
        handling status mapping from is_active boolean, and normalizing role.
        """
        status = "active" if getattr(user_obj, "is_active", True) else "inactive"
        # try to extract a role (string, dict or id)
        role_val = None
        if hasattr(user_obj, "role"):
            if hasattr(user_obj.role, "name"):
                role_val = user_obj.role.name
            elif isinstance(user_obj.role, dict):
                if "name" in user_obj.role:
                    role_val = user_obj.role["name"]
                else:
                    role_val = user_obj.role
            else:
                role_val = user_obj.role
        return User(
            user_id=user_obj.user_id,
            username=user_obj.username,
            email=user_obj.email,
            full_name=user_obj.full_name,
            phone=user_obj.phone,
            status=status,
            profile_image_path=user_obj.profile_image_path,
            created_at=getattr(user_obj, "created_at", None),
            updated_at=getattr(user_obj, "updated_at", None),
            last_login=getattr(user_obj, "last_login", None),
            role=role_val,
        )


class UserCreate(UserBase):
    """
    Schema for creating a new user.
    """
    password: str = Field(..., description="User password (hashed at storage)")


class UserUpdate(BaseModel):
    """
    Fields for updating user records (all optional for PATCH semantics).
    - Status should only be "active" or "inactive" for compatibility.
    - Accepts role update in the same flexible format as UserBase.
    """
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    status: Optional[str] = Field(
        None,
        description="Account status; only 'active' or 'inactive' are supported for compatibility."
    )
    profile_image_path: Optional[str] = None
    role: Optional[Union[str, dict, int]] = Field(
        None, description="User's role (optional on update, flexible type)"
    )


class UserInDBBase(UserBase):
    """
    Fields returned by the DB for user records.
    """
    user_id: int = Field(..., description="Primary key for the user")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = Field(None, description="Timestamp of the last user login")

    class Config:
        orm_mode = True


class User(UserInDBBase):
    """
    API schema for reading user records. Unified from global components.
    """
    pass


class UserInDB(UserInDBBase):
    """
    Internal DB schema for user records; may include sensitive/internal-use fields.
    """
    hashed_password: Optional[str] = Field(None, description="Hashed password for internal storage")


# Alias for API response models
UserResponse = User

class UserStatusUpdate(BaseModel):
    """
    Schema for updating user activation status.
    """
    is_active: bool = Field(..., description="Set user to active or inactive status")