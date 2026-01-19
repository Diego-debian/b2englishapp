"""
main.py
--------

Entry point for the FastAPI application.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import List, Optional, Any, Dict
import os
import json

from fastapi import Depends, FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.exceptions import RequestValidationError
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from sqlalchemy import text

from app import models
from app.database import get_db
from app.settings import get_settings
from app.errors import http_exception_handler, validation_exception_handler
from app.schemas import (
    # Auth
    Token, UserCreate, UserOut,
    # Verb
    VerbOut, VerbCreate, VerbUpdate,
    # Tense
    TenseOut, TenseCreate, ExampleOut, ExampleCreate,
    # Activity
    ActivityOut, ActivityCreate, QuestionOut, QuestionCreate,
    AttemptStartIn, AttemptStartOut, SubmitAnswerIn, SubmitAnswerOut,
    # Focus
    FocusResultsIn, FocusResultsOut,
    # Progress
    ProgressUpdateIn, UserProgressUpdate, UserProgressOut
)
# Lazy import for router to avoid circular deps if needed, but standard is top level.
# However, we only need it if flagged. 

from app.crud import (
    # Auth
    authenticate_user, register_user, get_user_by_username,
    # User
    get_user, update_user_xp, get_user_stats,
    # Verb
    get_verbs, get_verb, create_verb, update_verb, delete_verb, search_verbs,
    # Tense
    list_tenses, create_tense, add_tense_example, list_examples_by_tense,
    # Activity / Attempts
    list_activities, create_activity, add_activity_question,
    get_activity, list_questions_by_activity, start_attempt, submit_answer,
    # Progress / Practice
    select_verbs_for_practice, update_user_progress,
    get_user_progress, initialize_user_progress, list_user_progress
)

# -------------------------------------------------------------------
# Settings / JWT
# -------------------------------------------------------------------
_settings = get_settings()

SECRET_KEY: str = _settings.SECRET_KEY
ALGORITHM: str = _settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES: int = _settings.ACCESS_TOKEN_EXPIRE_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user


# -------------------------------------------------------------------
# App
# -------------------------------------------------------------------
app = FastAPI(
    title=_settings.APP_NAME,
    version=_settings.VERSION,
    description=_settings.DESCRIPTION,
)

# -------------------------------------------------------------------
# Startup: Crear tablas automáticamente
# -------------------------------------------------------------------
@app.on_event("startup")
def on_startup():
    """Ensure database tables exist before handling requests."""
    from app.database import create_tables
    create_tables()
    print("✅ Database tables verified/created")

# Structured error responses
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# -------------------------------------------------------------------
# CORS (ROBUSTO – NO DEPEN hookup de settings.py)
# -------------------------------------------------------------------
raw_origins = os.getenv("CORS_ORIGINS", "[]")

try:
    parsed = json.loads(raw_origins)
    cors_origins = parsed if isinstance(parsed, list) else []
except Exception:
    cors_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

# Fallback seguro para dev
if not cors_origins:
    cors_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_started_at = datetime.now(timezone.utc)

# -------------------------------------------------------------------
# ROOT / HEALTH
# -------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "B2 English Verb Trainer API is running"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "alive"}


@app.get("/ready", tags=["Health"])
def ready(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        raise HTTPException(status_code=503, detail="Database not ready")


@app.get("/metrics", tags=["Health"])
def metrics():
    uptime_seconds = int((datetime.now(timezone.utc) - _started_at).total_seconds())
    return {"uptime_seconds": uptime_seconds}


# -------------------------------------------------------------------
# AUTH
# -------------------------------------------------------------------
@app.post("/token", response_model=Token, tags=["Authentication"])
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@app.post("/register", response_model=UserOut, tags=["Authentication"])
def register(payload: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, payload.username, payload.email, payload.password)


@app.get("/me", response_model=UserOut, tags=["Authentication"])
def me(current_user: models.User = Depends(get_current_user)):
    return current_user


# -------------------------------------------------------------------
# USERS
# -------------------------------------------------------------------
# Feature Flagged Routers
if _settings.FEATURE_CONTENT_API_V1:
    from app.routers import content
    app.include_router(content.router)
    print("✅ Content API mounted (Feature Flag ON)")

@app.get("/users/{user_id}", response_model=UserOut, tags=["Users"])
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/users/{user_id}/xp", response_model=UserOut, tags=["Users"])
def add_xp(
    user_id: int,
    xp_gain: int = Query(..., ge=0, le=100000),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = update_user_xp(db, user_id, xp_gain)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users/{user_id}/stats", response_model=dict, tags=["Users"])
def stats(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return get_user_stats(db, user_id)


# -------------------------------------------------------------------
# VERBS
# -------------------------------------------------------------------
@app.get("/verbs", response_model=List[VerbOut], tags=["Verbs"])
def list_all_verbs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return get_verbs(db, skip=skip, limit=limit)


@app.get("/verbs/search", response_model=List[VerbOut], tags=["Verbs"])
def search_verbs_route(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return search_verbs(db, q, limit)


@app.get("/verbs/{verb_id}", response_model=VerbOut, tags=["Verbs"])
def read_verb(
    verb_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verb = get_verb(db, verb_id)
    if not verb:
        raise HTTPException(status_code=404, detail="Verb not found")
    return verb


@app.post("/verbs", response_model=VerbOut, tags=["Verbs"])
def create_verb_route(
    payload: VerbCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return create_verb(db, payload)


@app.patch("/verbs/{verb_id}", response_model=VerbOut, tags=["Verbs"])
def update_verb_route(
    verb_id: int,
    payload: VerbUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verb = update_verb(db, verb_id, payload)
    if not verb:
        raise HTTPException(status_code=404, detail="Verb not found")
    return verb


@app.delete("/verbs/{verb_id}", tags=["Verbs"])
def delete_verb_route(
    verb_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ok = delete_verb(db, verb_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Verb not found")
    return {"message": "Verb deleted"}


# -------------------------------------------------------------------
# TENSES
# -------------------------------------------------------------------
@app.get("/tenses", response_model=List[TenseOut], tags=["Tenses"])
def list_tenses_route(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return list_tenses(db)


@app.post("/tenses", response_model=TenseOut, tags=["Tenses"])
def create_tense_route(
    payload: TenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return create_tense(db, payload)


@app.get("/tenses/{tense_id}/examples", response_model=List[ExampleOut], tags=["Tenses"])
def list_examples_route(
    tense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return list_examples_by_tense(db, tense_id)


@app.post("/tenses/{tense_id}/examples", response_model=ExampleOut, tags=["Tenses"])
def add_example_route(
    tense_id: int,
    payload: ExampleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    data: Dict[str, Any] = payload.model_dump()
    data["tense_id"] = tense_id
    return add_tense_example(db, data)


# -------------------------------------------------------------------
# ACTIVITIES / ATTEMPTS
# -------------------------------------------------------------------
@app.get("/activities", response_model=List[ActivityOut], tags=["Activities"])
def list_activities_route(
    tense_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if tense_id is None:
        return db.query(models.Activity).all()
    return list_activities(db, tense_id)


@app.post("/activities", response_model=ActivityOut, tags=["Activities"])
def create_activity_route(
    payload: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return create_activity(db, payload)


@app.get("/activities/{activity_id}", response_model=ActivityOut, tags=["Activities"])
def get_activity_route(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    activity = get_activity(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@app.get("/activities/{activity_id}/questions", response_model=List[QuestionOut], tags=["Activities"])
def list_questions_route(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return list_questions_by_activity(db, activity_id)


@app.post("/activities/{activity_id}/questions", response_model=QuestionOut, tags=["Activities"])
def add_question_route(
    activity_id: int,
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    data: Dict[str, Any] = payload.model_dump()
    data["activity_id"] = activity_id
    return add_activity_question(db, data)


@app.post("/attempts/start", response_model=AttemptStartOut, tags=["Attempts"])
def start_attempt_route(
    payload: AttemptStartIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    attempt = start_attempt(db, current_user.id, payload.activity_id)
    return {"attempt_id": attempt.id, "activity_id": attempt.activity_id}


@app.post("/attempts/submit", response_model=SubmitAnswerOut, tags=["Attempts"])
def submit_answer_route(
    payload: SubmitAnswerIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return submit_answer(
        db,
        current_user.id,
        payload.attempt_id,
        payload.question_id,
        payload.user_answer,
        payload.time_ms,
    )


# -------------------------------------------------------------------
# PRACTICE / PROGRESS
# -------------------------------------------------------------------
@app.get("/practice/select", response_model=List[VerbOut], tags=["Practice"])
def select_practice_route(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return select_verbs_for_practice(db, current_user.id, limit)


@app.post("/progress/update", response_model=UserProgressOut, tags=["Progress"])
def update_progress_route(
    payload: ProgressUpdateIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Check if progress record exists (requires /progress/init first)
    existing = get_user_progress(db, current_user.id, payload.verb_id)
    if existing is None:
        raise HTTPException(
            status_code=404,
            detail="Progress not initialized; call POST /progress/init first"
        )
    
    return update_user_progress(
        db,
        current_user.id,
        payload.verb_id,
        payload.is_correct,
    )


@app.get("/progress", response_model=List[UserProgressOut], tags=["Progress"])
def get_progress_route(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return list_user_progress(db, current_user.id)


@app.post("/progress/init", tags=["Progress"])
def init_progress_route(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    count = initialize_user_progress(db, current_user.id)
    return {"initialized": count}


# -------------------------------------------------------------------
# FOCUS PRACTICE RESULTS
# -------------------------------------------------------------------
@app.post("/focus/results", response_model=FocusResultsOut, tags=["Focus"])
def record_focus_results(
    payload: FocusResultsIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Record Focus Practice session results as events.
    
    Creates:
    - 1 ActivityAttempt (with meta containing tense_slug)
    - N QuestionAttempt records (one per result)
    
    Does NOT:
    - Calculate XP or streaks
    - Update user stats
    - Create new tables
    """
    from datetime import datetime
    
    # Create a "virtual" attempt for Focus (no real activity_id needed)
    # We use activity_id=0 as a sentinel for Focus sessions
    # Or we could find/create a Focus activity — for now, use meta
    
    # For minimal approach: reuse first activity or create synthetic
    # Check if a Focus-type activity exists, else use activity_id=1 as placeholder
    focus_activity = db.query(models.Activity).filter(
        models.Activity.type == "focus"
    ).first()
    
    if not focus_activity:
        # Use first available activity as placeholder (minimal approach)
        focus_activity = db.query(models.Activity).first()
        if not focus_activity:
            raise HTTPException(status_code=404, detail="No activities available")
    
    # Create ActivityAttempt
    now = datetime.utcnow()
    attempt = models.ActivityAttempt(
        user_id=current_user.id,
        activity_id=focus_activity.id,
        started_at=now,
        completed_at=now,
        score=sum(1 for r in payload.results if r.is_correct),
        xp_gained=0,  # Focus doesn't award XP via this endpoint
        meta={"source": "focus", "tense_slug": payload.tense_slug}
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    # Create QuestionAttempts
    # Note: Focus uses string IDs, but QuestionAttempt.question_id is Integer FK
    # We store the Focus question_id in user_answer field for reference
    questions_recorded = 0
    correct_count = 0
    
    for result in payload.results:
        # Since Focus questions are not in activity_questions table,
        # we create a minimal record with question_id=0 (or skip FK validation)
        # For now, we store Focus question ID in user_answer for traceability
        q_attempt = models.QuestionAttempt(
            user_id=current_user.id,
            attempt_id=attempt.id,
            question_id=0,  # Placeholder - Focus questions not in DB
            user_answer=result.question_id,  # Store Focus question ID here
            is_correct=result.is_correct,
            time_ms=None
        )
        db.add(q_attempt)
        questions_recorded += 1
        if result.is_correct:
            correct_count += 1
    
    db.commit()
    
    return FocusResultsOut(
        attempt_id=attempt.id,
        questions_recorded=questions_recorded,
        correct=correct_count,
        total=len(payload.results)
    )
