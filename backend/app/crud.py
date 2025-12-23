"""
crud.py
--------

Data access layer for the B2 English learning application. Functions in
this module encapsulate common queries and business logic, keeping the
route handlers clean. They operate on SQLAlchemy session objects and
return ORM models or simple Python types.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

from . import models
from . import schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -----------------------------------------------------------------------------
# Password utilities
# -----------------------------------------------------------------------------

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hashed version."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate a bcrypt hash for the given password."""
    return pwd_context.hash(password)


# -----------------------------------------------------------------------------
# User-related functions
# -----------------------------------------------------------------------------

def get_user(db: Session, user_id: int) -> models.User | None:
    """Retrieve a user by their ID."""
    return db.get(models.User, user_id)


def get_user_by_username(db: Session, username: str) -> models.User | None:
    """Retrieve a user by their username."""
    return db.query(models.User).filter(models.User.username == username).first()


def authenticate_user(db: Session, username: str, password: str) -> models.User | None:
    """Authenticate a user with username and password."""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, username: str, password: str) -> models.User:
    """
    Create a new user with the provided username and hashed password.
    Raises IntegrityError if username already exists.
    """
    try:
        hashed_password = get_password_hash(password)
        user = models.User(username=username, hashed_password=hashed_password, total_xp=0)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise


def update_user_xp(db: Session, user_id: int, xp_gain: int) -> models.User | None:
    """Update user's total XP."""
    user = get_user(db, user_id)
    if user:
        user.total_xp += xp_gain
        db.commit()
        db.refresh(user)
    return user


def get_user_stats(db: Session, user_id: int) -> Dict[str, Any]:
    """Get comprehensive statistics for a user's learning progress."""
    from sqlalchemy import func
    
    # Total verbs in the system
    total_verbs = db.query(func.count(models.Verb.id)).scalar() or 0
    
    # User's progress records
    user_progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user_id
    ).all()
    
    verbs_learned = len(user_progress)
    
    # Verbs due now
    now = datetime.utcnow()
    due_count = sum(1 for p in user_progress if p.srs_date <= now)
    
    # Calculate streaks and mastery
    total_streak = sum(p.streak for p in user_progress)
    total_mistakes = sum(p.mistakes for p in user_progress)
    
    avg_streak = total_streak / max(verbs_learned, 1)
    
    # Calculate mastery level (0-100%)
    if verbs_learned > 0:
        # Verbs with streak >= 5 are considered mastered
        mastered = sum(1 for p in user_progress if p.streak >= 5)
        mastery_percentage = (mastered / verbs_learned) * 100
    else:
        mastery_percentage = 0
    
    # Get user's XP
    user = get_user(db, user_id)
    user_xp = user.total_xp if user else 0
    
    # Calculate level based on XP (simple formula: 100 XP per level)
    level = (user_xp // 100) + 1
    xp_to_next_level = 100 - (user_xp % 100)
    
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
        "learning_streak_days": calculate_learning_streak(db, user_id),
    }


def calculate_learning_streak(db: Session, user_id: int) -> int:
    """Calculate consecutive days the user has practiced."""
    # This is a simplified version - in production you'd want to track
    # actual practice dates in a separate table
    progress_count = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user_id
    ).count()
    
    # Simple approximation: if user has progress records, they've been practicing
    return min(progress_count // 5, 30)  # Max streak of 30 days for demo


def reset_user_progress(db: Session, user_id: int) -> bool:
    """Reset all progress for a user (for testing or starting over)."""
    # Delete all progress records
    deleted = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user_id
    ).delete()
    
    # Reset XP
    user = get_user(db, user_id)
    if user:
        user.total_xp = 0
        db.commit()
        return True
    
    db.commit()
    return deleted > 0


# -----------------------------------------------------------------------------
# Spaced Repetition System (SRS) functions
# -----------------------------------------------------------------------------

def select_verbs_for_practice(db: Session, user_id: int, limit: int = 10) -> List[models.Verb]:
    """
    Select a list of verbs for a user's practice session based on spaced
    repetition. Verbs are chosen in three passes:

    1. Due verbs: those with ``srs_date`` <= now.
    2. New verbs: if fewer than ``limit`` verbs are due, random new verbs
       that the user hasn't seen before are added.
    3. Fallback: if still empty, pick random verbs from the whole set.

    Returns a list of Verb objects ready for practice.
    """
    now = datetime.utcnow()
    session_verbs = []

    # 1) Due verbs for the user (srs_date <= now)
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

    # 2) New verbs (no progress yet for this user)
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
        
        # Create progress records for new verbs
        for verb in new_verbs:
            prog = models.UserProgress(
                user_id=user_id,
                verb_id=verb.id,
                srs_date=now,  # due immediately
                mistakes=0,
                streak=0,
            )
            db.add(prog)
        
        if new_verbs:
            db.commit()
            session_verbs.extend(new_verbs)
            remaining_slots -= len(new_verbs)

    # 3) FALLBACK: If still need more verbs (or none were due/new)
    if not session_verbs or remaining_slots > 0:
        # Get verbs with lowest streak or oldest practice
        fallback_limit = remaining_slots if session_verbs else limit
        
        # First try verbs with low streaks
        low_streak_stmt = (
            select(models.Verb)
            .join(models.UserProgress, models.UserProgress.verb_id == models.Verb.id)
            .where(models.UserProgress.user_id == user_id)
            .order_by(models.UserProgress.streak.asc(), models.UserProgress.srs_date.asc())
            .limit(fallback_limit)
        )
        fallback_verbs = db.scalars(low_streak_stmt).all()
        
        # If not enough, get random verbs
        if len(fallback_verbs) < fallback_limit:
            random_stmt = (
                select(models.Verb)
                .order_by(func.random())
                .limit(fallback_limit - len(fallback_verbs))
            )
            random_verbs = db.scalars(random_stmt).all()
            fallback_verbs.extend(random_verbs)
            
            # Create progress for any random verbs that don't have it
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
            # If this is our first batch, replace session_verbs
            if not session_verbs:
                session_verbs = fallback_verbs
            else:
                session_verbs.extend(fallback_verbs)

    return session_verbs[:limit]  # Ensure we don't exceed the limit


def update_user_progress(db: Session, user_id: int, verb_id: int, correct: bool) -> models.UserProgress:
    """
    Update a user's progress for a given verb based on whether they answered
    correctly. Implements spaced repetition logic:
    
    - Correct answer: doubles interval (up to max 32 days), grants XP
    - Incorrect answer: resets streak, schedules review for tomorrow, grants minimal XP
    
    Returns the updated UserProgress record.
    """
    now = datetime.utcnow()
    
    # Get or create progress record
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
    
    # Update based on answer correctness
    if correct:
        prog.streak += 1
        # Cap interval at 32 days (2^5)
        interval_days = min(2 ** prog.streak, 32)
        prog.srs_date = now + timedelta(days=interval_days)
        
        # Grant XP based on streak (10-60 XP)
        xp_gain = 10 * (1 + min(prog.streak, 5))
        update_user_xp(db, user_id, xp_gain)
    else:
        prog.mistakes += 1
        prog.streak = 0
        prog.srs_date = now + timedelta(days=1)
        
        # Minimal XP for attempt (encourages practice even when wrong)
        update_user_xp(db, user_id, 2)
    
    db.add(prog)
    db.commit()
    db.refresh(prog)
    return prog


def get_user_progress(db: Session, user_id: int, verb_id: int) -> models.UserProgress | None:
    """Get a user's progress for a specific verb."""
    return (
        db.query(models.UserProgress)
        .filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.verb_id == verb_id
        )
        .first()
    )


# -----------------------------------------------------------------------------
# CRUD functions for Verb management
# -----------------------------------------------------------------------------

def get_verbs(db: Session, skip: int = 0, limit: int = 100) -> List[models.Verb]:
    """Return verbs from the database with pagination."""
    return db.query(models.Verb).order_by(models.Verb.infinitive.asc()).offset(skip).limit(limit).all()


def get_verb(db: Session, verb_id: int) -> models.Verb | None:
    """Retrieve a single verb by its ID."""
    return db.get(models.Verb, verb_id)


def get_verb_by_infinitive(db: Session, infinitive: str) -> models.Verb | None:
    """Retrieve a verb by its infinitive form."""
    return db.query(models.Verb).filter(models.Verb.infinitive == infinitive).first()


def create_verb(db: Session, data: schemas.VerbCreate) -> models.Verb:
    """
    Create a new verb record.
    Raises IntegrityError if a verb with the same infinitive already exists.
    """
    try:
        verb = models.Verb(
            infinitive=data.infinitive.strip(),
            past=data.past.strip(),
            participle=data.participle.strip(),
            translation=data.translation.strip(),
            example_b2=data.example_b2.strip(),
        )
        db.add(verb)
        db.commit()
        db.refresh(verb)
        return verb
    except IntegrityError:
        db.rollback()
        raise


def update_verb(db: Session, verb_id: int, data: schemas.VerbUpdate) -> models.Verb | None:
    """
    Update an existing verb. Only non-None fields in ``data`` will be
    applied to the verb. Returns the updated verb, or None if not found.
    """
    verb = db.get(models.Verb, verb_id)
    if verb is None:
        return None
    
    updated = False
    for field, value in data.dict(exclude_unset=True).items():
        if value is not None:
            setattr(verb, field, value.strip() if isinstance(value, str) else value)
            updated = True
    
    if updated:
        db.add(verb)
        db.commit()
        db.refresh(verb)
    
    return verb


def delete_verb(db: Session, verb_id: int) -> bool:
    """Delete a verb by its ID. Returns True if deleted, False otherwise."""
    verb = db.get(models.Verb, verb_id)
    if not verb:
        return False
    
    db.delete(verb)
    db.commit()
    return True


def search_verbs(db: Session, query: str, limit: int = 20) -> List[models.Verb]:
    """Search verbs by infinitive, past, participle, or translation."""
    search_term = f"%{query}%"
    return (
        db.query(models.Verb)
        .filter(
            models.Verb.infinitive.ilike(search_term) |
            models.Verb.past.ilike(search_term) |
            models.Verb.participle.ilike(search_term) |
            models.Verb.translation.ilike(search_term)
        )
        .order_by(models.Verb.infinitive.asc())
        .limit(limit)
        .all()
    )


def get_verb_stats(db: Session) -> Dict[str, Any]:
    """Get statistics about the verbs in the system."""
    total_verbs = db.query(func.count(models.Verb.id)).scalar() or 0
    
    # Count verbs by first letter
    letter_counts = {}
    verbs = db.query(models.Verb).all()
    for verb in verbs:
        first_letter = verb.infinitive[0].upper() if verb.infinitive else "?"
        letter_counts[first_letter] = letter_counts.get(first_letter, 0) + 1
    
    # Average length of infinitive
    avg_length = db.query(func.avg(func.length(models.Verb.infinitive))).scalar() or 0
    
    return {
        "total_verbs": total_verbs,
        "average_infinitive_length": round(avg_length, 1),
        "verbs_by_letter": dict(sorted(letter_counts.items())),
        "last_updated": datetime.utcnow().isoformat(),
    }


# -----------------------------------------------------------------------------
# Batch operations for initial data seeding
# -----------------------------------------------------------------------------

def bulk_create_verbs(db: Session, verbs_data: List[Dict[str, str]]) -> int:
    """
    Create multiple verbs in a single transaction.
    Returns the number of verbs successfully created.
    """
    created = 0
    try:
        for verb_data in verbs_data:
            # Check if verb already exists
            existing = get_verb_by_infinitive(db, verb_data["infinitive"])
            if not existing:
                verb = models.Verb(
                    infinitive=verb_data["infinitive"].strip(),
                    past=verb_data["past"].strip(),
                    participle=verb_data["participle"].strip(),
                    translation=verb_data["translation"].strip(),
                    example_b2=verb_data["example_b2"].strip(),
                )
                db.add(verb)
                created += 1
        
        db.commit()
        return created
    except Exception as e:
        db.rollback()
        raise


def initialize_user_progress(db: Session, user_id: int) -> int:
    """
    Initialize progress records for all verbs for a new user.
    Useful when a user registers and we want them to have some initial progress.
    Returns the number of progress records created.
    """
    now = datetime.utcnow()
    verbs = get_verbs(db)
    created = 0
    
    for verb in verbs:
        # Check if progress already exists
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