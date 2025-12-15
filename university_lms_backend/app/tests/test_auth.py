"""
Test Auth Module - get_current_user function
---------------------------------------------
Tests to verify the fix for the get_current_user function in auth.py.
Ensures proper call to UserService.get_by_id with correct parameters.
"""

from unittest.mock import MagicMock, patch
from fastapi import HTTPException
import pytest

from app.core.auth import get_current_user


class TestGetCurrentUser:
    """Test the get_current_user function"""

    @pytest.mark.asyncio
    async def test_get_current_user_calls_correct_method(self, db_session):
        """Test that get_current_user calls UserService.get_by_id with correct parameters"""
        # Arrange
        mock_request = MagicMock()
        mock_request.headers.get.return_value = "Bearer valid_token"
        
        # Mock the JWT decode to return a valid payload
        with patch('app.core.auth.jwt.decode') as mock_jwt_decode:
            mock_jwt_decode.return_value = {"sub": "123"}
            
            # Mock UserService.get_by_id to return a mock user
            with patch('app.core.auth.UserService.get_by_id') as mock_get_by_id:
                mock_user = MagicMock()
                mock_user.is_active = True
                mock_get_by_id.return_value = mock_user
                
                # Act
                result = await get_current_user(request=mock_request, db=db_session)
                
                # Assert
                # Verify that get_by_id was called (not get_user_by_id)
                mock_get_by_id.assert_called_once()
                
                # Verify the correct parameters were passed
                call_args = mock_get_by_id.call_args
                assert call_args[1]['db'] == db_session, "db parameter should be passed"
                assert call_args[1]['user_id'] == 123, "user_id should be converted to int"
                
                # Verify the result is the user
                assert result == mock_user

    @pytest.mark.asyncio
    async def test_get_current_user_raises_when_user_not_found(self, db_session):
        """Test that get_current_user raises 403 when user is not found"""
        # Arrange
        mock_request = MagicMock()
        mock_request.headers.get.return_value = "Bearer valid_token"
        
        with patch('app.core.auth.jwt.decode') as mock_jwt_decode:
            mock_jwt_decode.return_value = {"sub": "999"}
            
            with patch('app.core.auth.UserService.get_by_id') as mock_get_by_id:
                mock_get_by_id.return_value = None
                
                # Act & Assert
                with pytest.raises(HTTPException) as exc_info:
                    await get_current_user(request=mock_request, db=db_session)
                
                assert exc_info.value.status_code == 403
                assert "not active or does not exist" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_current_user_raises_when_user_inactive(self, db_session):
        """Test that get_current_user raises 403 when user is inactive"""
        # Arrange
        mock_request = MagicMock()
        mock_request.headers.get.return_value = "Bearer valid_token"
        
        with patch('app.core.auth.jwt.decode') as mock_jwt_decode:
            mock_jwt_decode.return_value = {"sub": "123"}
            
            with patch('app.core.auth.UserService.get_by_id') as mock_get_by_id:
                mock_user = MagicMock()
                mock_user.is_active = False
                mock_get_by_id.return_value = mock_user
                
                # Act & Assert
                with pytest.raises(HTTPException) as exc_info:
                    await get_current_user(request=mock_request, db=db_session)
                
                assert exc_info.value.status_code == 403
                assert "not active or does not exist" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_current_user_raises_when_user_id_not_numeric(self, db_session):
        """Test that get_current_user raises 401 when user_id in JWT is not numeric"""
        # Arrange
        mock_request = MagicMock()
        mock_request.headers.get.return_value = "Bearer valid_token"
        
        with patch('app.core.auth.jwt.decode') as mock_jwt_decode:
            mock_jwt_decode.return_value = {"sub": "invalid_user_id"}
            
            # Act & Assert
            with pytest.raises(HTTPException) as exc_info:
                await get_current_user(request=mock_request, db=db_session)
            
            assert exc_info.value.status_code == 401
            assert "Token payload invalid" in exc_info.value.detail
