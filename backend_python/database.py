from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend_python.config import settings  # use settings
import os

# Prefer an explicit DATABASE_URL (from env or .env) for dev convenience (e.g. sqlite)
DATABASE_URL = os.environ.get("DATABASE_URL") or getattr(settings, "DATABASE_URL", None)

# If DATABASE_URL not provided, build it from Postgres settings (psycopg2 dialect)
if not DATABASE_URL:
    DATABASE_URL = f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def client():
    return None