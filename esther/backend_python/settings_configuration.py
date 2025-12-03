# esther/backend_python/config.py
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Pydantic Settings Configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DATABASE_NAME: str = "inclusive_learning"

    # PostgreSQL (Optional/Future use)
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "inclusive_learning"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # JWT & Security
    SECRET_KEY: str = "your-super-secret-key-change-this"
    REFRESH_SECRET_KEY: str = "your-super-secret-refresh-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # Development helpers
    # If True, skip Postgres and use a local SQLite DB for development.
    DISABLE_SQL: bool = True
    SQLITE_DB_FILE: str = "dev_sqlite.db"

    # CORS - Can be set as comma-separated string or list
    # If set as environment variable, it will be a string like: "https://app.vercel.app,http://localhost:5173"
    CORS_ORIGINS: str | List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

settings = Settings()
