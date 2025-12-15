"""
Department Schema (Production)
------------------------------
Pydantic schemas for Department model, ensuring validation and serialization in API requests/responses.

- No sample, demo, or test code.
- Follows global schema conventions for consistency across the LMS.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DepartmentBase(BaseModel):
    """
    Shared base schema for department entity create/update/read.
    """
    name: str = Field(..., description="Name of the department")
    code: Optional[str] = Field(None, description="Unique code for the department, e.g., 'CS'")
    description: Optional[str] = Field(None, description="General description of the department")
    status: Optional[str] = Field("active", description="Status of the department (active/inactive)")

class DepartmentCreate(DepartmentBase):
    """
    Schema for creating a new department.
    """
    pass

class DepartmentUpdate(BaseModel):
    """
    Fields for updating department details (all optional).
    """
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class DepartmentInDBBase(DepartmentBase):
    """
    Base fields provided by the DB for response/internal use.
    """
    department_id: int = Field(..., description="Primary key for the department entry")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Department(DepartmentInDBBase):
    """
    Schema for API reading of department records.
    """
    pass

class DepartmentInDB(DepartmentInDBBase):
    """
    Internal schema for department DB objects.
    """
    pass