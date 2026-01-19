"""
app/models/content.py
Modelo para el sistema de contenido (CMS/Blog).
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from .base import BaseModel

class ContentItem(BaseModel):
    __tablename__ = "content_items"

    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    excerpt = Column(String, nullable=True)
    body = Column(Text, nullable=False)
    status = Column(Enum("draft", "published", "archived", name="content_status_enum"), default="draft", nullable=False)
    
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ContentItem slug={self.slug!r} status={self.status!r}>"
