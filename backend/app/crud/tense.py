from sqlalchemy.orm import Session
from typing import List, Any, Optional
from sqlalchemy.exc import IntegrityError

from .. import models
from ..schemas.tense import TenseCreate, ExampleCreate
from .base import handle_integrity_error


def _get(obj: Any, key: str, default=None):
    """
    Permite leer tanto dict (seed JSON) como Pydantic (requests API).
    """
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def list_tenses(db: Session) -> List[models.Tense]:
    return db.query(models.Tense).order_by(models.Tense.id.asc()).all()


def create_tense(db: Session, data: Any) -> models.Tense:
    """
    Acepta:
      - TenseCreate (Pydantic)
      - dict (desde seed JSON)
    """
    try:
        code = (_get(data, "code", "") or "").strip()
        name = (_get(data, "name", "") or "").strip()
        description = _get(data, "description", None)

        if not code or not name:
            raise ValueError("Tense 'code' and 'name' are required")

        tense = models.Tense(code=code, name=name, description=description)
        db.add(tense)
        db.commit()
        db.refresh(tense)
        return tense

    except IntegrityError as e:
        db.rollback()
        handle_integrity_error(e, "Tense with this code already exists")


def add_tense_example(db: Session, data: Any) -> models.TenseExample:
    """
    Acepta:
      - ExampleCreate (Pydantic)
      - dict (desde seed JSON)

    IMPORTANTE:
    Tu modelo TenseExample requiere tense_id y verb_id, además de sentence.
    Si tu JSON de seed NO tiene verb_id, este método fallará (y eso es correcto),
    porque en DB es necesario.
    """
    tense_id = _get(data, "tense_id", None)
    verb_id = _get(data, "verb_id", None)
    sentence = (_get(data, "sentence", "") or "").strip()
    translation = _get(data, "translation", None)
    note = _get(data, "note", None)

    if tense_id is None:
        raise ValueError("Example requires 'tense_id'")
    if verb_id is None:
        raise ValueError("Example requires 'verb_id' (your schema/model expects it)")
    if not sentence:
        raise ValueError("Example requires 'sentence'")

    ex = models.TenseExample(
        tense_id=tense_id,
        verb_id=verb_id,
        sentence=sentence,
        translation=(translation.strip() if isinstance(translation, str) and translation else None),
        note=(note.strip() if isinstance(note, str) and note else None),
    )
    db.add(ex)
    db.commit()
    db.refresh(ex)
    return ex


def list_examples_by_tense(db: Session, tense_id: int) -> List[models.TenseExample]:
    return (
        db.query(models.TenseExample)
        .filter(models.TenseExample.tense_id == tense_id)
        .order_by(models.TenseExample.id.desc())
        .all()
    )
