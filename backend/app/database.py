"""
database.py
---------------

Database configuration and session management.

This module now reads configuration via ``Settings`` instead of directly
accessing environment variables. Centralizing configuration helps avoid
hard‑coding secrets and makes it explicit which variables are required to
run the application【395836646368524†L320-L333】.
"""

from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.settings import get_settings


# Retrieve configuration from settings
_settings = get_settings()

if not _settings.DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable must be set (e.g. postgresql+psycopg2://user:pass@db:5432/dbname)"
    )

# Create SQLAlchemy engine
engine = create_engine(
    _settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=30,
    echo=False,  # Set to True for SQL debugging
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)

# Base class for all models
Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session.

    The session is closed after the request is processed to avoid leaking
    connections. This pattern is recommended by the SQLAlchemy docs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables based on the models metadata.

    This helper is useful in testing or local development where you want to
    initialise the database schema automatically.
    """
    # Import all models to ensure they are registered with Base.metadata
    from app import models  # noqa: F401
    
    Base.metadata.create_all(bind=engine)