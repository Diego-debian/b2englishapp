# app/settings.py
from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = Field("B2 English Verb Trainer API")
    VERSION: str = Field("1.0.0", alias="APP_VERSION")
    DESCRIPTION: str = Field("API para aprendizaje de verbos irregulares en inglés nivel B2", alias="APP_DESCRIPTION")

    SECRET_KEY: str = Field(..., alias="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60 * 24, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    ALGORITHM: str = Field("HS256", alias="JWT_ALGORITHM")

    CORS_ORIGINS: List[str] = Field(default_factory=list, alias="CORS_ORIGINS")
    DATABASE_URL: str = Field(..., alias="DATABASE_URL")
    
    # Feature Flags
    FEATURE_CONTENT_API_V1: bool = Field(False, alias="FEATURE_CONTENT_API_V1")
    FEATURE_CONTENT_ADMIN_WRITE_V1: bool = Field(False, alias="FEATURE_CONTENT_ADMIN_WRITE_V1")

    # ✅ Pydantic v2 config
    model_config = SettingsConfigDict(
        case_sensitive=False,
        extra="ignore",
        # 🔥 IMPORTANTE: NO forzar env_file aquí cuando usas docker-compose
        # env_file=".env",
    )

    @field_validator("CORS_ORIGINS", mode="before")
    def split_cors_origins(cls, value):
        if value is None:
            return []
        if isinstance(value, str):
            s = value.strip()
            if not s:
                return []
            # permite JSON string '["a","b"]' o csv "a,b"
            if s.startswith("["):
                import json
                return json.loads(s)
            return [x.strip() for x in s.split(",") if x.strip()]
        return value


@lru_cache()
def get_settings() -> Settings:
    return Settings()
