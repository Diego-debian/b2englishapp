"""
app/models/activity.py
Modelos de actividades y preguntas
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import BaseModel

class Activity(BaseModel):
    __tablename__ = "activities"

    tense_id = Column(Integer, ForeignKey("tenses.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(Integer, default=1, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relaciones
    tense = relationship("Tense", back_populates="activities")
    questions = relationship("ActivityQuestion", back_populates="activity", cascade="all, delete-orphan")
    attempts = relationship("ActivityAttempt", back_populates="activity", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Activity {self.title} ({self.type})>"


class ActivityQuestion(BaseModel):
    __tablename__ = "activity_questions"

    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    kind = Column(String, nullable=False)
    prompt = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    xp_reward = Column(Integer, default=10, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)

    # Relaciones
    activity = relationship("Activity", back_populates="questions")
    attempts = relationship("QuestionAttempt", back_populates="question", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ActivityQuestion id={self.id} kind={self.kind}>"


class ActivityAttempt(BaseModel):
    __tablename__ = "activity_attempts"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    score = Column(Integer, default=0, nullable=False)
    xp_gained = Column(Integer, default=0, nullable=False)
    meta = Column(JSON, nullable=True)

    # Relaciones
    user = relationship("User", back_populates="activity_attempts")
    activity = relationship("Activity", back_populates="attempts")
    question_attempts = relationship("QuestionAttempt", back_populates="attempt", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ActivityAttempt user_id={self.user_id} activity_id={self.activity_id} score={self.score}>"


class QuestionAttempt(BaseModel):
    __tablename__ = "question_attempts"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("activity_questions.id", ondelete="CASCADE"), nullable=False)
    attempt_id = Column(Integer, ForeignKey("activity_attempts.id", ondelete="CASCADE"), nullable=False)
    
    user_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, default=False, nullable=False)
    time_ms = Column(Integer, nullable=True)

    # Relaciones
    question = relationship("ActivityQuestion", back_populates="attempts")
    attempt = relationship("ActivityAttempt", back_populates="question_attempts")
    user = relationship("User", back_populates="question_attempts")

    def __repr__(self):
        return f"<QuestionAttempt question_id={self.question_id} correct={self.is_correct}>"