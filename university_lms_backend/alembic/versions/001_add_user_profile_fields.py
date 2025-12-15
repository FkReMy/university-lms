"""Add user profile fields

Revision ID: 001_add_user_profile_fields
Revises: 
Create Date: 2025-12-15 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_add_user_profile_fields'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """
    Add phone, profile_image_path, and last_login columns to users table.
    These fields enable the User schema to properly serialize user data for the frontend.
    """
    # Add phone column
    op.add_column('users', sa.Column('phone', sa.String(length=20), nullable=True))
    
    # Add profile_image_path column
    op.add_column('users', sa.Column('profile_image_path', sa.String(length=512), nullable=True))
    
    # Add last_login column
    op.add_column('users', sa.Column('last_login', sa.DateTime(timezone=True), nullable=True))


def downgrade():
    """
    Remove the added columns.
    """
    op.drop_column('users', 'last_login')
    op.drop_column('users', 'profile_image_path')
    op.drop_column('users', 'phone')
