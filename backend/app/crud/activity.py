from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
from fastapi import HTTPException

from .. import models
from ..schemas.activity import ActivityCreate, QuestionCreate
from .user import update_user_xp


def _get(obj: Any, key: str, default=None):
    """Lee key desde dict o desde atributo (Pydantic)."""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def list_activities(db: Session, tense_id: int) -> List[models.Activity]:
    return (
        db.query(models.Activity)
        .filter(models.Activity.tense_id == tense_id)
        .order_by(models.Activity.id.desc())
        .all()
    )


def create_activity(db: Session, data: Any) -> models.Activity:
    """
    Acepta:
      - ActivityCreate (Pydantic)
      - dict (seed JSON)
    """
    tense_id = _get(data, "tense_id")
    type_ = (_get(data, "type", "") or "").strip()
    title = (_get(data, "title", "") or "").strip()
    description = _get(data, "description", None)
    difficulty = _get(data, "difficulty", 1)
    is_active = _get(data, "is_active", True)

    if tense_id is None:
        raise ValueError("Activity requires 'tense_id'")
    if not type_:
        raise ValueError("Activity requires 'type'")
    if not title:
        raise ValueError("Activity requires 'title'")

    a = models.Activity(
        tense_id=int(tense_id),
        type=type_,
        title=title,
        description=description,
        difficulty=difficulty,
        is_active=is_active,
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


def add_activity_question(db: Session, data: Any) -> models.ActivityQuestion:
    """
    Acepta:
      - QuestionCreate (Pydantic)
      - dict (seed JSON)
    """
    activity_id = _get(data, "activity_id")
    kind = (_get(data, "kind", "") or "").strip()
    prompt = _get(data, "prompt", None)
    options = _get(data, "options", None)
    correct_answer = _get(data, "correct_answer", None)
    explanation = _get(data, "explanation", None)
    xp_reward = _get(data, "xp_reward", 0)
    sort_order = _get(data, "sort_order", 0)

    if activity_id is None:
        raise ValueError("Question requires 'activity_id'")
    if not kind:
        raise ValueError("Question requires 'kind'")
    if prompt is None:
        raise ValueError("Question requires 'prompt'")
    if correct_answer is None:
        raise ValueError("Question requires 'correct_answer'")

    q = models.ActivityQuestion(
        activity_id=int(activity_id),
        kind=kind,
        prompt=prompt,
        options=options,
        correct_answer=correct_answer,
        explanation=explanation,
        xp_reward=xp_reward,
        sort_order=sort_order,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return q


def get_activity(db: Session, activity_id: int) -> models.Activity | None:
    return db.get(models.Activity, activity_id)


def list_questions_by_activity(db: Session, activity_id: int) -> List[models.ActivityQuestion]:
    return (
        db.query(models.ActivityQuestion)
        .filter(models.ActivityQuestion.activity_id == activity_id)
        .order_by(models.ActivityQuestion.sort_order.asc(), models.ActivityQuestion.id.asc())
        .all()
    )


def start_attempt(db: Session, user_id: int, activity_id: int) -> models.ActivityAttempt:
    att = models.ActivityAttempt(
        user_id=user_id,
        activity_id=activity_id,
        score=0,
        xp_gained=0,
        started_at=datetime.utcnow(),
    )
    db.add(att)
    db.commit()
    db.refresh(att)
    return att


def submit_answer(
    db: Session,
    user_id: int,
    attempt_id: int,
    question_id: int,
    user_answer: str | None,
    time_ms: int | None = None,
) -> Dict[str, Any]:
    attempt = db.get(models.ActivityAttempt, attempt_id)
    if not attempt or attempt.user_id != user_id:
        raise HTTPException(status_code=404, detail="Attempt not found")

    q = db.get(models.ActivityQuestion, question_id)
    if not q or q.activity_id != attempt.activity_id:
        raise HTTPException(status_code=404, detail="Question not found")

    normalized = (user_answer or "").strip().lower()
    correct = (q.correct_answer or "").strip().lower()
    is_correct = normalized == correct
    xp_awarded = q.xp_reward if is_correct else 0

    qa = models.QuestionAttempt(
        user_id=user_id,
        question_id=question_id,
        attempt_id=attempt_id,
        user_answer=user_answer,
        is_correct=is_correct,
        time_ms=time_ms,
    )
    db.add(qa)

    if is_correct:
        attempt.score += 1
        attempt.xp_gained += xp_awarded

    db.commit()

    if xp_awarded > 0:
        update_user_xp(db, user_id=user_id, xp_gain=xp_awarded)

    return {
        "is_correct": is_correct,
        "xp_awarded": xp_awarded,
        "correct_answer": correct if not is_correct else None,
    }
