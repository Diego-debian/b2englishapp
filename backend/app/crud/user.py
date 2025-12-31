from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from .. import models
from ..schemas.user import UserCreate
from .base import get_password_hash, verify_password, handle_integrity_error

def get_user(db: Session, user_id: int) -> models.User | None:
    return db.get(models.User, user_id)

def get_user_by_username(db: Session, username: str) -> models.User | None:
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str) -> models.User | None:
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def register_user(db: Session, username: str, email: str, password: str) -> models.User:
    try:
        hashed_password = get_password_hash(password)
        user = models.User(
            username=username,
            email=email,
            hashed_password=hashed_password, 
            total_xp=0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError as e:
        db.rollback()
        handle_integrity_error(e, "Username or email already exists")

def update_user_xp(db: Session, user_id: int, xp_gain: int) -> models.User | None:
    user = get_user(db, user_id)
    if user:
        user.total_xp += xp_gain
        db.commit()
        db.refresh(user)
    return user

def get_user_stats(db: Session, user_id: int) -> Dict[str, Any]:
    total_verbs = db.query(func.count(models.Verb.id)).scalar() or 0
    
    user_progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user_id
    ).all()
    
    verbs_learned = len(user_progress)
    now = datetime.utcnow()
    due_count = sum(1 for p in user_progress if p.srs_date <= now)
    
    total_streak = sum(p.streak for p in user_progress)
    total_mistakes = sum(p.mistakes for p in user_progress)
    avg_streak = total_streak / max(verbs_learned, 1)
    
    if verbs_learned > 0:
        mastered = sum(1 for p in user_progress if p.streak >= 5)
        mastery_percentage = (mastered / verbs_learned) * 100
    else:
        mastery_percentage = 0
    
    user = get_user(db, user_id)
    user_xp = user.total_xp if user else 0
    
    level = (user_xp // 100) + 1
    xp_to_next_level = 100 - (user_xp % 100)
    learning_streak_days = min(verbs_learned // 5, 30)
    
    return {
        "user_id": user_id,
        "total_verbs": total_verbs,
        "verbs_learned": verbs_learned,
        "verbs_remaining": total_verbs - verbs_learned,
        "due_verbs": due_count,
        "average_streak": round(avg_streak, 1),
        "total_mistakes": total_mistakes,
        "mastery_percentage": round(mastery_percentage, 1),
        "total_xp": user_xp,
        "level": level,
        "xp_to_next_level": xp_to_next_level,
        "learning_streak_days": learning_streak_days,
    }

def list_verbs_for_user(db: Session, user_id: int):
    verbs = db.query(models.Verb).all()
    user_progress = {}
    for progress in db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user_id
    ).all():
        user_progress[progress.verb_id] = progress
    return verbs