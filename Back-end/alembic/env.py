# alembic/env.py

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from alembic import context
from sqlalchemy import MetaData

# Load environment variables from .env
load_dotenv()

# Add project root to PYTHONPATH so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import Base and all models so Alembic can detect them
from db.base import Base

# Import all models explicitly (this ensures they are registered with Base)
from db.models.user import User

from db.models.item import Item
from db.models.grocery import GroceryList, GroceryListItem
from db.models.expiration import ExpirationAlert

# Set target_metadata for autogenerate
target_metadata = Base.metadata

# Alembic Config object
config = context.config

# Set SQLAlchemy URL dynamically from DATABASE_URL in .env
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()