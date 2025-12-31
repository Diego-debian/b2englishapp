from passlib.context import CryptContext
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Error handling utilities
def handle_integrity_error(error: IntegrityError, detail: str = "Resource already exists"):
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)
