"""
Admin Schema (Production)
-------------------------
Pydantic schemas for Admin model, used for validating requests and responses related to admin accounts.

- No sample, demo, or test code.
- Follows the global schema and Pydantic conventions for unified architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AdminBase(BaseModel):
    """
    Shared base schema for admin creation and update.
    """
    user_id: int = Field(..., description="Related user ID for the admin account")
    role: Optional[str] = Field(None, description="Role name or label for the admin, e.g., 'superadmin'")

class AdminCreate(AdminBase):
    """
    Schema for creating an Admin record.
    """
    pass

class AdminUpdate(BaseModel):
    """
    Schema for updating an Admin record.
    """
    user_id: Optional[int] = None
    role: Optional[str] = None

class AdminInDBBase(AdminBase):
    """
    Schema for common fields returned by DB, for internal/response use.
    """
    admin_id: int = Field(..., description="Admin primary key")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Admin(AdminInDBBase):
    """
    Schema for Admin read operations.
    """
    pass

class AdminInDB(AdminInDBBase):
    """
    Schema for Admin returned internally from database operations.
    """
    pass