"""
main.py
--------

Entry point for the FastAPI application.  Defines API routes and wires
dependencies together.  On startup it ensures that database tables exist
by calling ``Base.metadata.create_all()``.
"""

from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt

from . import models, schemas, crud
from .database import Base, engine, get_db
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware

SECRET_KEY = "your-secret-key"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# Create all tables on application startup.  In a production system you
# would typically use Alembic migrations instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="B2 English Verb Trainer", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user.username, user.password)


@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/verbs/{user_id}", response_model=List[schemas.VerbOut])
def get_verbs_for_user(user_id: int, db: Session = Depends(get_db)):
    """
    Return a list of verbs to practise for a given user.  The list is
    generated using a simple spaced repetition algorithm implemented in
    ``crud.select_verbs_for_practice``.

    :param user_id: ID of the user requesting verbs
    :param db: Database session (injected)
    :returns: A list of up to 10 verbs ready for review
    """
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    verbs = crud.select_verbs_for_practice(db, user_id=user_id, limit=10)
    return verbs


# -----------------------------------------------------------------------------
# CRUD API for Verbs
#
# These endpoints allow managing the verb list: listing all verbs, creating
# new ones, updating existing entries and deleting them.  They are intended
# for administrative use.  We do not include authentication/authorization in
# this MVP; in a real application you would secure these routes.

@app.get("/verbs", response_model=list[schemas.VerbOut])
def list_verbs(db: Session = Depends(get_db)):
    """Return all verbs sorted alphabetically by infinitive."""
    verbs = crud.get_verbs(db)
    return verbs


@app.post("/verbs", response_model=schemas.VerbOut, status_code=status.HTTP_201_CREATED)
def create_verb(verb: schemas.VerbCreate, db: Session = Depends(get_db)):
    """Create a new verb.  Returns the created verb."""
    try:
        new_verb = crud.create_verb(db, verb)
    except Exception as e:
        # Likely a unique constraint violation or other DB error
        raise HTTPException(status_code=400, detail=str(e))
    return new_verb


@app.get("/verb/{verb_id}", response_model=schemas.VerbOut)
def get_verb(verb_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific verb by its ID."""
    verb = crud.get_verb(db, verb_id)
    if not verb:
        raise HTTPException(status_code=404, detail="Verb not found")
    return verb


@app.put("/verb/{verb_id}", response_model=schemas.VerbOut)
def update_verb(verb_id: int, update: schemas.VerbUpdate, db: Session = Depends(get_db)):
    """Update an existing verb.  Partial updates are allowed.  Returns the updated
    verb object."""
    verb = crud.update_verb(db, verb_id, update)
    if not verb:
        raise HTTPException(status_code=404, detail="Verb not found")
    return verb


@app.delete("/verb/{verb_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_verb(verb_id: int, db: Session = Depends(get_db)):
    """Delete a verb by its ID."""
    deleted = crud.delete_verb(db, verb_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Verb not found")
    return {"status": "deleted"}


@app.post("/progress")
def update_progress(update: schemas.UserProgressUpdate, db: Session = Depends(get_db)):
    """
    Update a user's progress for a particular verb.  The request body
    indicates whether the user answered the question correctly.  The
    endpoint returns a simple status message rather than exposing the
    internal state of the progress record.
    """
    user = crud.get_user(db, update.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Validate that the verb exists
    verb = db.get(models.Verb, update.verb_id)
    if not verb:
        raise HTTPException(status_code=404, detail="Verb not found")
    # Update progress and ignore the returned record for security
    crud.update_user_progress(db, user_id=update.user_id, verb_id=update.verb_id, correct=update.correct)
    # Update user's XP
    crud.update_user_xp(db, user_id=update.user_id, xp_gain=update.xp)
    return {"status": "success"}


@app.post("/users")
def create_user(username: str, db: Session = Depends(get_db)):
    """
    Create a new user with the specified username.  In a production system
    you would also handle password hashing and validation.  If a user with
    the same username already exists this endpoint will return a 400 error.
    """
    existing = db.query(models.User).filter(models.User.username == username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    user = crud.create_user(db, username=username)
    return {"id": user.id, "username": user.username}