from sqlalchemy.orm import Session
from sqlalchemy import select, func
from datetime import datetime, timedelta
from typing import List

from .. import models
from .user import update_user_xp

def select_verbs_for_practice(db: Session, user_id: int, limit: int = 10) -> List[models.Verb]:
    now = datetime.utcnow()
    session_verbs = []

    due_stmt = (
        select(models.Verb)
        .join(models.UserProgress, models.UserProgress.verb_id == models.Verb.id)
        .where(models.UserProgress.user_id == user_id)
        .where(models.UserProgress.srs_date <= now)
        .order_by(models.UserProgress.srs_date.asc())
        .limit(limit)
    )
    due_verbs = db.scalars(due_stmt).all()
    
    if len(due_verbs) >= limit:
        return due_verbs
    
    session_verbs.extend(due_verbs)
    remaining_slots = limit - len(due_verbs)

    if remaining_slots > 0:
        subquery = (
            select(models.UserProgress.verb_id)
            .where(models.UserProgress.user_id == user_id)
        )
        new_stmt = (
            select(models.Verb)
            .where(models.Verb.id.not_in(subquery))
            .order_by(func.random())
            .limit(remaining_slots)
        )
        new_verbs = db.scalars(new_stmt).all()
        
        for verb in new_verbs:
            prog = models.UserProgress(
                user_id=user_id,
                verb_id=verb.id,
                srs_date=now,
                mistakes=0,
                streak=0,
            )
            db.add(prog)
        
        if new_verbs:
            db.commit()
            session_verbs.extend(new_verbs)
            remaining_slots -= len(new_verbs)

    if not session_verbs or remaining_slots > 0:
        fallback_limit = remaining_slots if session_verbs else limit
        
        low_streak_stmt = (
            select(models.Verb)
            .join(models.UserProgress, models.UserProgress.verb_id == models.Verb.id)
            .where(models.UserProgress.user_id == user_id)
            .order_by(models.UserProgress.streak.asc(), models.UserProgress.srs_date.asc())
            .limit(fallback_limit)
        )
        fallback_verbs = db.scalars(low_streak_stmt).all()
        
        if len(fallback_verbs) < fallback_limit:
            random_stmt = (
                select(models.Verb)
                .order_by(func.random())
                .limit(fallback_limit - len(fallback_verbs))
            )
            random_verbs = db.scalars(random_stmt).all()
            fallback_verbs.extend(random_verbs)
            
            for verb in random_verbs:
                existing = db.query(models.UserProgress).filter(
                    models.UserProgress.user_id == user_id,
                    models.UserProgress.verb_id == verb.id
                ).first()
                if not existing:
                    prog = models.UserProgress(
                        user_id=user_id,
                        verb_id=verb.id,
                        srs_date=now,
                        mistakes=0,
                        streak=0,
                    )
                    db.add(prog)
        
        if fallback_verbs:
            db.commit()
            if not session_verbs:
                session_verbs = fallback_verbs
            else:
                session_verbs.extend(fallback_verbs)

    return session_verbs[:limit]

def update_user_progress(
    db: Session, user_id: int, verb_id: int, correct: bool
) -> models.UserProgress:
    now = datetime.utcnow()
    
    prog = (
        db.query(models.UserProgress)
        .filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.verb_id == verb_id
        )
        .first()
    )
    
    if prog is None:
        prog = models.UserProgress(
            user_id=user_id,
            verb_id=verb_id,
            srs_date=now,
            mistakes=0,
            streak=0,
        )
        db.add(prog)
        db.commit()
        db.refresh(prog)
    
    if correct:
        prog.streak += 1
        interval_days = min(2 ** prog.streak, 32)
        prog.srs_date = now + timedelta(days=interval_days)
        xp_gain = 10 * (1 + min(prog.streak, 5))
        update_user_xp(db, user_id, xp_gain)
    else:
        prog.mistakes += 1
        prog.streak = 0
        prog.srs_date = now + timedelta(days=1)
        update_user_xp(db, user_id, 2)
    
    db.add(prog)
    db.commit()
    db.refresh(prog)
    return prog

def get_user_progress(db: Session, user_id: int, verb_id: int) -> models.UserProgress | None:
    return (
        db.query(models.UserProgress)
        .filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.verb_id == verb_id
        )
        .first()
    )

def initialize_user_progress(db: Session, user_id: int) -> int:
    now = datetime.utcnow()
    verbs = db.query(models.Verb).all()
    created = 0
    
    for verb in verbs:
        existing = get_user_progress(db, user_id, verb.id)
        if not existing:
            prog = models.UserProgress(
                user_id=user_id,
                verb_id=verb.id,
                srs_date=now,
                mistakes=0,
                streak=0,
            )
            db.add(prog)
            created += 1
    
    if created > 0:
        db.commit()
    
    return created