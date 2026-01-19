"""
app/routers/content.py
Router público para contenido (artículos/guías).
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ContentItemPublic, ContentList
from app.crud import (
    get_published_content_by_slug,
    list_published_content,
    count_published_content
)

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
    List published content.
    """
    items = list_published_content(db, skip=skip, limit=limit)
    total = count_published_content(db)
    return {"items": items, "total": total}

@router.get("/{slug}", response_model=ContentItemPublic)
def get_content_detail(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Get a single published article by slug.
    """
    item = get_published_content_by_slug(db, slug)
    if not item:
        raise HTTPException(status_code=404, detail="Content not found")
    return item
