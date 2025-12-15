"""
Test Authentication & Authorization - Role Relationship Fix
----------------------------------------------------------
Tests to verify the fix for the role relationship mismatch where auth.py
expected multiple roles but User model only supports a single role.
"""

import pytest
from fastapi import HTTPException

try:
    from app.core.auth import require_role
except ImportError:
    # If imports fail due to missing dependencies, skip these tests
    pytest.skip("Cannot import auth module - skipping tests", allow_module_level=True)

# Mock the models to avoid database dependencies
class MockRole:
    def __init__(self, name):
        self.name = name

class MockUser:
    def __init__(self, role_name=None):
        self.role = MockRole(role_name) if role_name else None
        self.user_id = 1
        self.is_active = True


class TestRequireRoleWithSingleRole:
    """Test the require_role function with single role relationship"""

    @pytest.mark.asyncio
    async def test_require_role_allows_user_with_matching_role(self):
        """Test that a user with the required role is allowed"""
        # Arrange - Create a mock user with admin role
        mock_user = MockUser("admin")
        
        # Create the role dependency
        role_dependency = require_role(["admin", "professor"])
        
        # Act - Call the dependency function with the mock user
        result = await role_dependency(current_user=mock_user)
        
        # Assert - User should be returned without exception
        assert result == mock_user

    @pytest.mark.asyncio
    async def test_require_role_blocks_user_with_wrong_role(self):
        """Test that a user without the required role is blocked"""
        # Arrange - Create a mock user with "student" role
        mock_user = MockUser("student")
        
        # Create the role dependency requiring admin or professor
        role_dependency = require_role(["admin", "professor"])
        
        # Act & Assert - Should raise HTTPException with 403
        with pytest.raises(HTTPException) as exc_info:
            await role_dependency(current_user=mock_user)
        
        assert exc_info.value.status_code == 403
        assert "lacks required role" in exc_info.value.detail.lower()

    @pytest.mark.asyncio
    async def test_require_role_handles_user_with_no_role(self):
        """Test that a user with no role (None) is blocked"""
        # Arrange - Create a mock user with no role
        mock_user = MockUser(None)
        
        # Create the role dependency
        role_dependency = require_role(["admin"])
        
        # Act & Assert - Should raise HTTPException with 403
        with pytest.raises(HTTPException) as exc_info:
            await role_dependency(current_user=mock_user)
        
        assert exc_info.value.status_code == 403
        assert "lacks required role" in exc_info.value.detail.lower()

    @pytest.mark.asyncio
    async def test_require_role_allows_any_of_multiple_roles(self):
        """Test that require_role allows any of the specified roles"""
        # Arrange - Create a mock user with "professor" role
        mock_user = MockUser("professor")
        
        # Create the role dependency requiring admin, professor, or student
        role_dependency = require_role(["admin", "professor", "student"])
        
        # Act - Call the dependency function with the mock user
        result = await role_dependency(current_user=mock_user)
        
        # Assert - User should be returned without exception
        assert result == mock_user

    @pytest.mark.asyncio
    async def test_require_role_single_required_role(self):
        """Test require_role with a single required role"""
        # Arrange - Create a mock user with admin role
        mock_user = MockUser("admin")
        
        # Create the role dependency requiring only admin
        role_dependency = require_role(["admin"])
        
        # Act - Call the dependency function with the mock user
        result = await role_dependency(current_user=mock_user)
        
        # Assert - User should be returned without exception
        assert result == mock_user

    @pytest.mark.asyncio
    async def test_require_role_case_sensitive_matching(self):
        """Test that role matching is case-sensitive"""
        # Arrange - Create a mock user with "Admin" (capital A)
        mock_user = MockUser("Admin")
        
        # Create the role dependency requiring "admin" (lowercase a)
        role_dependency = require_role(["admin"])
        
        # Act & Assert - Should raise HTTPException because of case mismatch
        with pytest.raises(HTTPException) as exc_info:
            await role_dependency(current_user=mock_user)
        
        assert exc_info.value.status_code == 403
