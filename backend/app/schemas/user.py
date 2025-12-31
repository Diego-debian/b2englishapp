from pydantic import BaseModel, Field, ConfigDict, field_validator
import re

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6)
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(pattern, v):
            raise ValueError('Email inválido')
        return v.lower()

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    total_xp: int
    model_config = ConfigDict(from_attributes=True)