"""
app/crud/content.py
Operaciones CRUD para contenido.
"""
from datetime import datetime
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


# Admin Write Operations

def get_content_by_slug(db: Session, slug: str) -> Optional[ContentItem]:
    """Retrieve a content item by slug (any status)."""
    return db.query(ContentItem).filter(ContentItem.slug == slug).first()


def create_content(db: Session, slug: str, title: str, body: str, 
                   excerpt: Optional[str] = None, status: str = "draft") -> ContentItem:
    """Create a new content item."""
    now = datetime.utcnow()
    published_at = now if status == "published" else None
    
    item = ContentItem(
        slug=slug,
        title=title,
        body=body,
        excerpt=excerpt,
        status=status,
        published_at=published_at,
        created_at=now,
        updated_at=now
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_content(db: Session, item: ContentItem, 
                   title: Optional[str] = None,
                   body: Optional[str] = None,
                   excerpt: Optional[str] = None,
                   status: Optional[str] = None) -> ContentItem:
    """Update an existing content item."""
    if title is not None:
        item.title = title
    if body is not None:
        item.body = body
    if excerpt is not None:
        item.excerpt = excerpt
    if status is not None:
        old_status = item.status
        item.status = status
        # Set published_at when transitioning to published
        if status == "published" and old_status != "published" and item.published_at is None:
            item.published_at = datetime.utcnow()
    
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def delete_content(db: Session, item: ContentItem) -> None:
    """Delete a content item."""
    db.delete(item)
    db.commit()

