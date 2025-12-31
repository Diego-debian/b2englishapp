"""
app/models/tense.py
Modelos de tiempos verbales
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Tense(BaseModel):
    __tablename__ = "tenses"

    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Relaciones
    examples = relationship("TenseExample", back_populates="tense", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="tense", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Tense {self.code}: {self.name}>"


class TenseExample(BaseModel):
    __tablename__ = "tense_examples"

    tense_id = Column(Integer, ForeignKey("tenses.id", ondelete="CASCADE"), nullable=False)
    verb_id = Column(Integer, ForeignKey("verbs.id", ondelete="SET NULL"), nullable=True)

    sentence = Column(Text, nullable=False)
    translation = Column(Text, nullable=True)
    note = Column(Text, nullable=True)

    # Relaciones
    tense = relationship("Tense", back_populates="examples")
    verb = relationship("Verb", back_populates="tense_examples")

    def __repr__(self):
        return f"<TenseExample tense_id={self.tense_id}>"