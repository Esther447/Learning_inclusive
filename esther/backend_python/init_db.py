# init_db.py
"""
Database initialization script
Creates initial data for development/testing
"""
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend_python.database import engine, Base
import backend_python.models  # ensure models registered

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Done.")

if __name__ == "__main__":
    init_db()