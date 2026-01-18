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
    SubmitAnswerIn, SubmitAnswerOut,
    FocusResultItem, FocusResultsIn, FocusResultsOut
)
from .progress import ProgressUpdateIn, UserProgressUpdate, UserProgressOut, StatsOverview

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
    # Focus
    "FocusResultItem", "FocusResultsIn", "FocusResultsOut",
    # Progress
    "ProgressUpdateIn", "UserProgressUpdate", "UserProgressOut", "StatsOverview",
]