# config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # Tell Pydantic to allow extra env variables
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"  # allow extra environment variables
    )

    # PostgreSQL Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "inclusive_learning"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DATABASE_NAME: str = "inclusive_learning"

    # JWT
    SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production-min-32-chars"
    REFRESH_SECRET_KEY: str = "your-refresh-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 43200

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

# Create settings instance
settings = Settings()

# Build DATABASE_URL dynamically for SQLAlchemy
DATABASE_URL = (
    f"postgresql://{settings.POSTGRES_USER}:"
    f"{settings.POSTGRES_PASSWORD}@"
    f"{settings.POSTGRES_HOST}:"
    f"{settings.POSTGRES_PORT}/"
    f"{settings.POSTGRES_DB}"
)
