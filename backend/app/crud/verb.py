from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from .. import models
from ..schemas.verb import VerbCreate, VerbUpdate
from .base import handle_integrity_error

def get_verbs(db: Session, skip: int = 0, limit: int = 100) -> List[models.Verb]:
    return db.query(models.Verb).order_by(models.Verb.infinitive.asc()).offset(skip).limit(limit).all()

def get_verb(db: Session, verb_id: int) -> models.Verb | None:
    return db.get(models.Verb, verb_id)

def get_verb_by_infinitive(db: Session, infinitive: str) -> models.Verb | None:
    return db.query(models.Verb).filter(models.Verb.infinitive == infinitive).first()

def create_verb(db: Session, data: VerbCreate) -> models.Verb:
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
    except IntegrityError as e:
        db.rollback()
        handle_integrity_error(e, "Verb with this infinitive already exists")

def update_verb(db: Session, verb_id: int, data: VerbUpdate) -> models.Verb | None:
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
    verb = db.get(models.Verb, verb_id)
    if not verb:
        return False
    db.delete(verb)
    db.commit()
    return True

def search_verbs(db: Session, query: str, limit: int = 20) -> List[models.Verb]:
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
    total_verbs = db.query(func.count(models.Verb.id)).scalar() or 0
    
    letter_counts = {}
    verbs = db.query(models.Verb).all()
    for verb in verbs:
        first_letter = verb.infinitive[0].upper() if verb.infinitive else "?"
        letter_counts[first_letter] = letter_counts.get(first_letter, 0) + 1
    
    avg_length = db.query(func.avg(func.length(models.Verb.infinitive))).scalar() or 0
    
    return {
        "total_verbs": total_verbs,
        "average_infinitive_length": round(avg_length, 1),
        "verbs_by_letter": dict(sorted(letter_counts.items())),
        "last_updated": datetime.utcnow().isoformat(),
    }

def bulk_create_verbs(db: Session, verbs_data: List[Dict[str, str]]) -> int:
    created = 0
    try:
        for verb_data in verbs_data:
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