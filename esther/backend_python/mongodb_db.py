# mongodb_db.py
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

# MongoDB connection URL
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DATABASE_NAME", "inclusive_learning")

# Create a MongoDB client
client = AsyncIOMotorClient(MONGODB_URL)
mongo_client = client  # For backward compatibility

# Get database
db = client[DB_NAME]

# Collection getters
def get_users_collection():
    return db["users"]

def get_courses_collection():
    return db["courses"]

def get_enrollments_collection():
    return db["enrollments"]

def get_progress_collection():
    return db["progress"]

def get_announcements_collection():
    return db["announcements"]