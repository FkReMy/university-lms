"""
Alembic Environment Script for University LMS Backend (Production)
------------------------------------------------------------------
Handles SQLAlchemy model imports and provides proper migration context
for running migrations with Alembic.

- Loads dynamic config (url, etc.) from the environment for security/unification.
- Integrates with app core to reflect latest DB schema.
- No demo/sample logic included. Production ready and clean.
"""

import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env

# Interpret the config file for Python logging.
config = context.config
fileConfig(config.config_file_name)

# Get the DB URL from either env or config (env has precedence for prod security)
DATABASE_URL = os.getenv("DATABASE_URL") or config.get_main_option("sqlalchemy.url")
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Import your app's MetaData for 'autogenerate' support.
# Unified for all models.
from app.models import (  # Import all model modules to ensure full registry.
    user, role, admin, student, professor, associate_teacher, department,
    specialization, course_catalog, academic_session, course_offering,
    section_group, enrollment, student_section_assignment, scheduled_slot,
    assignment, assignment_file, assignment_submission, quiz, quiz_file,
    question, question_option, quiz_attempt, quiz_answer,
    quiz_file_submission, grade, room, uploaded_file, notification
)
from app.models.base import Base  # A Base = declarative_base() subclass common to all models

target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode without DB connectivity."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode with DB connectivity."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # Detect column type differences
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()