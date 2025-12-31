"""
app/models/base.py
Clase base para todos los modelos con campos comunes
"""
from fastapi import HTTPException, status
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from app.database import Base as DeclarativeBase

class BaseModel(DeclarativeBase):
    """Modelo base con campos comunes"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convierte el modelo a diccionario"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}