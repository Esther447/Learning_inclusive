# esther/backend_python/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend_python.config import settings

# ------------------ MongoDB Connection ------------------
# Fix: Use MONGODB_URL, not DATABASE_URL
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.MONGODB_DATABASE_NAME]

# ------------------ PostgreSQL / SQL Connection ------------------
# Construct SQL URL dynamically
SQL_DATABASE_URL = f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

# Fallback for development if Postgres isn't running/needed immediately or for SQLite testing
# SQL_DATABASE_URL = "sqlite:///./sql_app.db" 

engine = create_engine(
    SQL_DATABASE_URL,
    # connect_args={"check_same_thread": False} if "sqlite" in SQL_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()
