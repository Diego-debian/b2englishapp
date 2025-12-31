# Exportar todos los esquemas
from .auth import Token, UserLogin
from .user import UserCreate, UserOut
from .verb import VerbOut, VerbCreate, VerbUpdate
from .tense import (
    TenseOut, TenseCreate,
    ExampleOut, ExampleCreate
)
from .activity import (
    ActivityOut, ActivityCreate,
    QuestionOut, QuestionCreate,
    AttemptStartIn, AttemptStartOut,
    SubmitAnswerIn, SubmitAnswerOut
)
from .progress import UserProgressUpdate, StatsOverview

__all__ = [
    # Auth
    "Token", "UserLogin",
    # User
    "UserCreate", "UserOut",
    # Verb
    "VerbOut", "VerbCreate", "VerbUpdate",
    # Tense
    "TenseOut", "TenseCreate",
    "ExampleOut", "ExampleCreate",
    # Activity
    "ActivityOut", "ActivityCreate",
    "QuestionOut", "QuestionCreate",
    "AttemptStartIn", "AttemptStartOut",
    "SubmitAnswerIn", "SubmitAnswerOut",
    # Progress
    "UserProgressUpdate", "StatsOverview",
]