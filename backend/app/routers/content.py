"""
app/routers/content.py
Router público para contenido (artículos/guías).
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.settings import get_settings
from app.schemas import ContentItemPublic, ContentList
from app.crud import (
    get_published_content_by_slug,
    list_published_content,
    count_published_content,
    get_content_by_slug
)
from app.models import ContentItem

_settings = get_settings()

router = APIRouter(
    prefix="/content",
    tags=["Content (Public)"]
)

@router.get("", response_model=ContentList)
def get_content_list(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List content. When FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1 is ON,
    only published content is returned. When OFF, all content is returned.
    """
    if _settings.FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1:
        # Published only
        items = list_published_content(db, skip=skip, limit=limit)
        total = count_published_content(db)
    else:
        # All content (backward compat / dev mode)
        items = db.query(ContentItem).order_by(
            ContentItem.updated_at.desc()
        ).offset(skip).limit(limit).all()
        total = db.query(ContentItem).count()
    
    return {"items": items, "total": total}

@router.get("/{slug}", response_model=ContentItemPublic)
def get_content_detail(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Get a single article by slug. When FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1 is ON,
    drafts return 404. When OFF, any status is returned.
    """
    if _settings.FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1:
        # Published only
        item = get_published_content_by_slug(db, slug)
    else:
        # Any status
        item = get_content_by_slug(db, slug)
    
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    return item

