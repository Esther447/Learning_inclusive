# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from motor.motor_asyncio import AsyncIOMotorClient
from backend_python.settings_configuration import settings

# ------------------ MongoDB ------------------
# Use the MongoDB URL from settings
mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
mongo_db = mongo_client[settings.MONGODB_DATABASE_NAME]

# ------------------ PostgreSQL / SQLAlchemy ------------------
if settings.DISABLE_SQL:
    # Use local sqlite fallback for development/testing when Postgres isn't available.
    DATABASE_URL = f"sqlite:///{settings.SQLITE_DB_FILE}"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Build DATABASE_URL for Postgres
    DATABASE_URL = f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
    engine = create_engine(DATABASE_URL, connect_args={})

    # Attempt a quick connection test; if it fails, fallback to sqlite
    try:
        with engine.connect() as conn:
            pass
    except OperationalError as e:
        print(f"⚠️  Warning: Postgres not available or auth failed: {e}. Falling back to sqlite file '{settings.SQLITE_DB_FILE}' for dev.")
        DATABASE_URL = f"sqlite:///{settings.SQLITE_DB_FILE}"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
