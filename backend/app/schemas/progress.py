from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class UserProgressUpdate(BaseModel):
    user_id: int = Field(..., description="ID of the user who answered the question")
    verb_id: int = Field(..., description="ID of the verb being practised")
    correct: bool = Field(..., description="Whether the user answered correctly")
    xp: int = Field(..., description="XP gained from this answer")

class UserProgressOut(BaseModel):
    id: int
    user_id: int
    verb_id: int
    srs_date: datetime
    mistakes: int
    streak: int
    model_config = ConfigDict(from_attributes=True)

class StatsOverview(BaseModel):
    streak: int
    totalMistakes: int
    totalXp: int
    model_config = ConfigDict(from_attributes=True)