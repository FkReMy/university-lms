"""
Test User Service - full_name to first_name/last_name mapping
-------------------------------------------------------------
Tests to verify the fix for the schema/model mismatch where UserCreate schema
has full_name field while User model has first_name and last_name fields.
"""

import pytest
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User


class TestFullNameSplitting:
    """Test the full_name splitting functionality in UserService"""

    def test_split_full_name_with_two_names(self):
        """Test splitting a full name with first and last name"""
        first, last = UserService._split_full_name("John Doe")
        assert first == "John"
        assert last == "Doe"

    def test_split_full_name_with_multiple_names(self):
        """Test splitting a full name with multiple parts"""
        first, last = UserService._split_full_name("John Michael Doe")
        assert first == "John"
        assert last == "Michael Doe"

    def test_split_full_name_with_single_name(self):
        """Test splitting a full name with only one name"""
        first, last = UserService._split_full_name("John")
        assert first == "John"
        assert last == ""

    def test_split_full_name_with_empty_string(self):
        """Test splitting an empty string"""
        first, last = UserService._split_full_name("")
        assert first == ""
        assert last == ""

    def test_split_full_name_with_none(self):
        """Test splitting None"""
        first, last = UserService._split_full_name(None)
        assert first == ""
        assert last == ""

    def test_split_full_name_with_whitespace(self):
        """Test splitting with extra whitespace"""
        first, last = UserService._split_full_name("  John   Doe  ")
        assert first == "John"
        assert last == "Doe"


class TestUserCreateWithFullName:
    """Test creating users with full_name field"""

    def test_create_user_with_full_name(self, db_session):
        """Test that creating a user with full_name properly splits it"""
        user_data = UserCreate(
            username="johndoe",
            email="john.doe@example.com",
            password="securepassword123",
            full_name="John Doe",
            status="active"
        )
        
        user_schema = UserService.create(db_session, user_data)
        
        # Verify the user was created
        assert user_schema is not None
        assert user_schema.username == "johndoe"
        assert user_schema.email == "john.doe@example.com"
        
        # Verify full_name is correctly computed from first_name and last_name
        assert user_schema.full_name == "John Doe"
        
        # Verify the actual database record has first_name and last_name
        db_user = db_session.query(User).filter(User.username == "johndoe").first()
        assert db_user is not None
        assert db_user.first_name == "John"
        assert db_user.last_name == "Doe"

    def test_create_user_with_single_name(self, db_session):
        """Test that creating a user with a single name works"""
        user_data = UserCreate(
            username="madonna",
            email="madonna@example.com",
            password="securepassword123",
            full_name="Madonna",
            status="active"
        )
        
        user_schema = UserService.create(db_session, user_data)
        
        # Verify the user was created
        assert user_schema is not None
        assert user_schema.username == "madonna"
        
        # Verify the actual database record
        db_user = db_session.query(User).filter(User.username == "madonna").first()
        assert db_user is not None
        assert db_user.first_name == "Madonna"
        assert db_user.last_name == ""

    def test_create_user_with_complex_name(self, db_session):
        """Test that creating a user with multiple names works"""
        user_data = UserCreate(
            username="jrrtolkien",
            email="tolkien@example.com",
            password="securepassword123",
            full_name="John Ronald Reuel Tolkien",
            status="active"
        )
        
        user_schema = UserService.create(db_session, user_data)
        
        # Verify the user was created
        assert user_schema is not None
        
        # Verify the actual database record
        db_user = db_session.query(User).filter(User.username == "jrrtolkien").first()
        assert db_user is not None
        assert db_user.first_name == "John"
        assert db_user.last_name == "Ronald Reuel Tolkien"

    def test_create_user_without_full_name(self, db_session):
        """Test that creating a user without full_name handles empty first/last names"""
        user_data = UserCreate(
            username="noname",
            email="noname@example.com",
            password="securepassword123",
            status="active"
        )
        
        # This should not raise an error, but first_name and last_name will be required by DB
        # Since the model has nullable=False, this should fail
        with pytest.raises(Exception):  # Will raise IntegrityError or similar
            UserService.create(db_session, user_data)


class TestUserUpdateWithFullName:
    """Test updating users with full_name field"""

    def test_update_user_with_full_name(self, db_session):
        """Test that updating a user with full_name properly splits it"""
        # First create a user
        user = User(
            username="testuser",
            email="test@example.com",
            password_hash="hashed_password",
            first_name="Test",
            last_name="User",
            is_active=True,
            is_verified=False
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        # Now update with full_name
        update_data = UserUpdate(full_name="Updated Name")
        updated_schema = UserService.update(db_session, user.user_id, update_data)
        
        # Verify the update worked
        assert updated_schema is not None
        assert updated_schema.full_name == "Updated Name"
        
        # Verify the database record
        db_user = db_session.query(User).filter(User.user_id == user.user_id).first()
        assert db_user.first_name == "Updated"
        assert db_user.last_name == "Name"

    def test_update_user_with_single_name(self, db_session):
        """Test that updating a user with a single name works"""
        # First create a user
        user = User(
            username="testuser2",
            email="test2@example.com",
            password_hash="hashed_password",
            first_name="Test",
            last_name="User",
            is_active=True,
            is_verified=False
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        # Now update with single name
        update_data = UserUpdate(full_name="Cher")
        updated_schema = UserService.update(db_session, user.user_id, update_data)
        
        # Verify the update worked
        assert updated_schema is not None
        
        # Verify the database record
        db_user = db_session.query(User).filter(User.user_id == user.user_id).first()
        assert db_user.first_name == "Cher"
        assert db_user.last_name == ""

    def test_update_user_without_full_name(self, db_session):
        """Test that updating a user without full_name doesn't affect names"""
        # First create a user
        user = User(
            username="testuser3",
            email="test3@example.com",
            password_hash="hashed_password",
            first_name="Test",
            last_name="User",
            is_active=True,
            is_verified=False
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        
        # Update without full_name
        update_data = UserUpdate(email="newemail@example.com")
        updated_schema = UserService.update(db_session, user.user_id, update_data)
        
        # Verify the update worked
        assert updated_schema is not None
        assert updated_schema.email == "newemail@example.com"
        
        # Verify names remain unchanged
        db_user = db_session.query(User).filter(User.user_id == user.user_id).first()
        assert db_user.first_name == "Test"
        assert db_user.last_name == "User"
