from pydantic import BaseModel
from .user import UserOut

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class UserLogin(BaseModel):
    username: str
    password: str