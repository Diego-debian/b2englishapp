"""
app/models/progress.py
Modelos de progreso del usuario (SRS)
"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import BaseModel

class UserProgress(BaseModel):
    __tablename__ = "user_progress"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    verb_id = Column(Integer, ForeignKey("verbs.id", ondelete="CASCADE"), nullable=False)
    srs_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    mistakes = Column(Integer, default=0, nullable=False)
    streak = Column(Integer, default=0, nullable=False)

    # Relaciones
    user = relationship("User", back_populates="progress")
    verb = relationship("Verb", back_populates="progress")

    def __repr__(self) -> str:
        return (
            f"<UserProgress user_id={self.user_id} verb_id={self.verb_id} "
            f"srs_date={self.srs_date} mistakes={self.mistakes} streak={self.streak}>"
        )