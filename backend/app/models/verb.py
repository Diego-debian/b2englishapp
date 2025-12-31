"""
app/models/verb.py
Modelos de verbos irregulares
"""
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .base import BaseModel

class Verb(BaseModel):
    __tablename__ = "verbs"

    infinitive = Column(String, unique=True, nullable=False)
    past = Column(String, nullable=False)
    participle = Column(String, nullable=False)
    translation = Column(String, nullable=False)
    example_b2 = Column(String, nullable=False)

    # Relaciones
    progress = relationship("UserProgress", back_populates="verb", cascade="all, delete-orphan")
    tense_examples = relationship("TenseExample", back_populates="verb", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Verb {self.infinitive}/{self.past}/{self.participle}>"