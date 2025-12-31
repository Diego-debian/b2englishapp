"""
app/models/user.py
Modelos relacionados con usuarios
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    total_xp = Column(Integer, default=0, nullable=False)

    # Relaciones
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    activity_attempts = relationship("ActivityAttempt", back_populates="user", cascade="all, delete-orphan")
    question_attempts = relationship("QuestionAttempt", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username!r} xp={self.total_xp}>"