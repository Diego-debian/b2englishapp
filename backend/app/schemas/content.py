"""
app/schemas/content.py
Schemas para el contenido público y admin.
"""
from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, ConfigDict, Field

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


# Admin Write Schemas

class ContentCreate(BaseModel):
    """Schema for creating new content."""
    slug: str = Field(..., min_length=1, max_length=100, pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    title: str = Field(..., min_length=1, max_length=255)
    body: str = Field(..., min_length=1)
    excerpt: Optional[str] = Field(None, max_length=500)
    status: Literal["draft", "published"] = Field("draft")


class ContentUpdate(BaseModel):
    """Schema for updating existing content. All fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    body: Optional[str] = Field(None, min_length=1)
    excerpt: Optional[str] = Field(None, max_length=500)
    status: Optional[Literal["draft", "published", "archived"]] = None


class ContentItemAdmin(BaseModel):
    """Full content item for admin responses."""
    id: int
    slug: str
    title: str
    excerpt: Optional[str] = None
    body: str
    status: str
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

