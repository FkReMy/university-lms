"""
Role Schema (Production)
------------------------
Pydantic schemas for the Role model, responsible for user roles and authorization management within the system.

- No sample, demo, or test code.
- Follows project-wide schema conventions for unified architecture.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class RoleBase(BaseModel):
    """
    Shared base schema for role creation, update, and read.
    """
    name: str = Field(..., description="Name/label of the role (e.g., student, admin, teacher)")
    description: Optional[str] = Field(None, description="Textual description of this role")
    status: Optional[str] = Field("active", description="Role status (active/inactive/etc.)")

class RoleCreate(RoleBase):
    """
    Fields for creating a new role.
    """
    pass

class RoleUpdate(BaseModel):
    """
    Fields allowed for role update (all optional).
    """
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class RoleInDBBase(RoleBase):
    """
    Fields provided by the DB for internal/response use.
    """
    role_id: int = Field(..., description="Primary key for the role entry")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Role(RoleInDBBase):
    """
    Schema for API reading of role records.
    """
    pass

class RoleResponse(RoleInDBBase):
    """
    Response schema for role records returned by API endpoints.
    """
    pass

class UserRoleAssignRequest(BaseModel):
    """
    Request schema for assigning a role to a user.
    """
    user_id: int = Field(..., description="User ID to assign the role to")
    role_id: int = Field(..., description="Role ID to assign")

class UserRoleRevokeRequest(BaseModel):
    """
    Request schema for revoking a role from a user.
    """
    user_id: int = Field(..., description="User ID to revoke the role from")
    role_id: int = Field(..., description="Role ID to revoke")

class UserRoleResponse(BaseModel):
    """
    Response schema for user-role assignment operations.
    """
    user_id: int = Field(..., description="User ID")
    role_id: int = Field(..., description="Role ID")
    role_name: Optional[str] = Field(None, description="Role name")
    assigned_at: Optional[datetime] = Field(None, description="When the role was assigned")

class RoleInDB(RoleInDBBase):
    """
    Internal DB schema for role records.
    """
    pass