"""
app/crud/content.py
Operaciones CRUD para contenido.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import ContentItem

def get_published_content_by_slug(db: Session, slug: str) -> Optional[ContentItem]:
    """Retrieve a single content item by slug, ONLY if published."""
    return db.query(ContentItem).filter(
        ContentItem.slug == slug,
        ContentItem.status == 'published'
    ).first()

def list_published_content(db: Session, skip: int = 0, limit: int = 20) -> List[ContentItem]:
    """List published content items with pagination."""
    return db.query(ContentItem).filter(
        ContentItem.status == 'published'
    ).order_by(ContentItem.published_at.desc()).offset(skip).limit(limit).all()

def count_published_content(db: Session) -> int:
    """Count total published items."""
    return db.query(ContentItem).filter(
        ContentItem.status == 'published'
    ).count()
