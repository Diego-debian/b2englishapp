"""
schemas.py
-------------

Pydantic models used for request and response bodies in the API. They
provide data validation and serialization/deserialization support. Only
publicly exposed fields are included to avoid leaking internal state.
"""

from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


# =========================
# User schemas
# =========================

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    total_xp: int

    # Pydantic v2 replacement for orm_mode = True
    model_config = ConfigDict(from_attributes=True)


# =========================
# Verb schemas
# =========================

class VerbOut(BaseModel):
    """Serialized representation of a verb returned to the client."""

    id: int
    infinitive: str
    past: str
    participle: str
    translation: str
    example_b2: str

    model_config = ConfigDict(from_attributes=True)


class VerbCreate(BaseModel):
    """Fields required when creating a new verb via the CRUD API."""

    infinitive: str = Field(..., description="Infinitive form of the verb")
    past: str = Field(..., description="Past simple form of the verb")
    participle: str = Field(..., description="Past participle form of the verb")
    translation: str = Field(..., description="Spanish translation of the verb")
    example_b2: str = Field(..., description="Example sentence at B2 level")


class VerbUpdate(BaseModel):
    """
    Fields that can be updated for an existing verb.
    All fields are optional so that partial updates are possible.
    Only the provided fields will be modified.
    """

    infinitive: str | None = Field(None, description="Infinitive form of the verb")
    past: str | None = Field(None, description="Past simple form of the verb")
    participle: str | None = Field(None, description="Past participle form of the verb")
    translation: str | None = Field(None, description="Spanish translation of the verb")
    example_b2: str | None = Field(None, description="Example sentence at B2 level")


# =========================
# Progress / XP schemas
# =========================

class UserProgressUpdate(BaseModel):
    """
    Data sent by the client when updating progress.
    It indicates which user practised which verb and whether the answer was correct.
    """

    user_id: int = Field(..., description="ID of the user who answered the question")
    verb_id: int = Field(..., description="ID of the verb being practised")
    correct: bool = Field(..., description="Whether the user answered correctly")
    xp: int = Field(..., description="XP gained from this answer")
