"""
Base Model (Production)
-----------------------
Declarative base for all SQLAlchemy models in the University LMS.

This module provides the shared Base class that all models inherit from.
"""

from sqlalchemy.ext.declarative import declarative_base

# Create the declarative base that all models inherit from
Base = declarative_base()
