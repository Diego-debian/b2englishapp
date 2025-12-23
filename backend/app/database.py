"""
database.py
---------------

Database configuration and session management for the FastAPI backend.  The
PostgreSQL connection URL is read from the ``DATABASE_URL`` environment
variable.  A SQLAlchemy ``Engine`` and scoped ``SessionLocal`` are provided,
along with a convenience dependency ``get_db`` that yields a session for use
in API endpoints.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read the database URL from the environment.  If the variable isn't set this
# will raise a KeyError, preventing the application from starting.  The
# ``docker-compose.yml`` defines this for you when running inside Docker.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable must be set (e.g. postgresql+psycopg2://user:pass@db:5432/dbname)"
    )

# Create a SQLAlchemy engine.  ``pool_pre_ping`` ensures that broken
# connections are recycled.
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

# Create a configured "Session" class and a session instance for each request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models.  All models should inherit from this.
Base = declarative_base()


def get_db():
    """Provide a transactional scope around a series of operations.

    This function is designed to be used as a FastAPI dependency. It
    yields a SQLAlchemy session and ensures that the session is closed
    after the request is processed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()