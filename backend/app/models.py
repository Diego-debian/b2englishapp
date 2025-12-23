"""
models.py
-----------

SQLAlchemy model definitions for the B2 English verb learning application.

There are three core models in the system:

``User``
    Represents a learner using the application.  For simplicity the MVP
    includes only an ``id`` and a ``username``, but additional fields such
    as a hashed password or email could be added in the future.

``Verb``
    Stores the irregular verbs to practice.  Each row includes the
    infinitive, past simple and past participle forms, a Spanish
    translation and a B2‑level example sentence.

``UserProgress``
    Tracks a particular user's progress with a verb.  It records the next
    scheduled review date for spaced repetition (``srs_date``), the number
    of mistakes made, and the current correct streak.  This table forms
    the basis for the SRS engine.
"""

from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    total_xp = Column(Integer, default=0, nullable=False)

    # A user can have many progress records.
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username!r}>"


class Verb(Base):
    __tablename__ = "verbs"

    id = Column(Integer, primary_key=True, index=True)
    infinitive = Column(String, unique=True, nullable=False)
    past = Column(String, nullable=False)
    participle = Column(String, nullable=False)
    translation = Column(String, nullable=False)
    example_b2 = Column(String, nullable=False)

    # Relationship to user progress. ``passive_deletes`` ensures progress
    # records are removed when a verb is deleted.
    progress = relationship("UserProgress", back_populates="verb", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Verb {self.infinitive}/{self.past}/{self.participle}>"


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    verb_id = Column(Integer, ForeignKey("verbs.id", ondelete="CASCADE"), nullable=False)
    srs_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    mistakes = Column(Integer, default=0, nullable=False)
    streak = Column(Integer, default=0, nullable=False)

    # ORM relationships back to user and verb.
    user = relationship("User", back_populates="progress")
    verb = relationship("Verb", back_populates="progress")

    def __repr__(self) -> str:
        return (
            f"<UserProgress user_id={self.user_id} verb_id={self.verb_id} "
            f"srs_date={self.srs_date} mistakes={self.mistakes} streak={self.streak}>"
        )