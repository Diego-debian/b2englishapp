from typing import Any
from pydantic import BaseModel, ConfigDict

class ActivityOut(BaseModel):
    id: int
    tense_id: int
    type: str
    title: str
    description: str | None = None
    difficulty: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class ActivityCreate(BaseModel):
    tense_id: int
    type: str
    title: str
    description: str | None = None
    difficulty: int = 1
    is_active: bool = True

class QuestionOut(BaseModel):
    id: int
    activity_id: int
    kind: str
    prompt: str
    options: Any | None = None
    explanation: str | None = None
    xp_reward: int
    sort_order: int
    model_config = ConfigDict(from_attributes=True)

class QuestionCreate(BaseModel):
    activity_id: int
    kind: str
    prompt: str
    options: Any | None = None
    correct_answer: str
    explanation: str | None = None
    xp_reward: int = 10
    sort_order: int = 0

class AttemptStartIn(BaseModel):
    activity_id: int

class AttemptStartOut(BaseModel):
    attempt_id: int
    activity_id: int

class SubmitAnswerIn(BaseModel):
    attempt_id: int
    question_id: int
    user_answer: str | None = None
    time_ms: int | None = None

class SubmitAnswerOut(BaseModel):
    is_correct: bool
    xp_awarded: int
    correct_answer: str | None = None