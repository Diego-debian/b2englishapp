"""
app/schemas/content.py
Schemas para el contenido público.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ContentItemPublic(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: Optional[str] = None
    body: str
    status: str
    published_at: Optional[datetime] = None
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ContentList(BaseModel):
    items: List[ContentItemPublic]
    total: int
