"""
app/routers/admin_content.py
Router protegido para operaciones admin de contenido.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.database import get_db
from app.settings import get_settings
from app.schemas.content import ContentCreate, ContentUpdate, ContentItemAdmin
from app.crud.content import (
    get_content_by_slug, create_content, update_content, delete_content
)
from app.crud import get_user_by_username
from app import models

_settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(
    prefix="/admin/content",
    tags=["Admin Content"]
)


async def get_current_user_for_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    """Validate JWT and return current user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, _settings.SECRET_KEY, algorithms=[_settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user


@router.post("", response_model=ContentItemAdmin, status_code=status.HTTP_201_CREATED)
def admin_create_content(
    payload: ContentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_for_admin)
):
    """
    Create a new content item.
    Requires authentication.
    """
    # Check for duplicate slug
    existing = get_content_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Content with slug '{payload.slug}' already exists"
        )
    
    item = create_content(
        db=db,
        slug=payload.slug,
        title=payload.title,
        body=payload.body,
        excerpt=payload.excerpt,
        status=payload.status
    )
    return item


@router.put("/{slug}", response_model=ContentItemAdmin)
def admin_update_content(
    slug: str,
    payload: ContentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_for_admin)
):
    """
    Update an existing content item.
    Requires authentication.
    """
    item = get_content_by_slug(db, slug)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Content with slug '{slug}' not found"
        )
    
    updated = update_content(
        db=db,
        item=item,
        title=payload.title,
        body=payload.body,
        excerpt=payload.excerpt,
        status=payload.status
    )
    return updated


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_content(
    slug: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_for_admin)
):
    """
    Delete a content item.
    Requires authentication.
    """
    item = get_content_by_slug(db, slug)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Content with slug '{slug}' not found"
        )
    
    delete_content(db, item)
    return None

