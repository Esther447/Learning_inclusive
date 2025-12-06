# MongoDB Database Access Layer
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional, List, Dict, Any
from backend_python.settings_configuration import settings
from backend_python.mongodb_models import (
    UserDocument, CourseDocument, EnrollmentDocument,
    ProgressDocument, AccessibilitySettingsDocument,
    QuizDocument, MentorshipGroupDocument
)

# MongoDB connection
mongo_client: Optional[AsyncIOMotorClient] = None
mongo_db: Optional[AsyncIOMotorDatabase] = None

def get_mongo_client() -> AsyncIOMotorClient:
    """Get or create MongoDB client"""
    global mongo_client
    if mongo_client is None:
        mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
    return mongo_client

def get_mongo_db() -> AsyncIOMotorDatabase:
    """Get MongoDB database"""
    global mongo_db
    if mongo_db is None:
        client = get_mongo_client()
        mongo_db = client[settings.MONGODB_DATABASE_NAME]
    return mongo_db

# Collection getters
def get_users_collection():
    return get_mongo_db()["users"]

def get_courses_collection():
    return get_mongo_db()["courses"]

def get_enrollments_collection():
    return get_mongo_db()["enrollments"]

def get_progress_collection():
    return get_mongo_db()["progress"]

def get_accessibility_settings_collection():
    return get_mongo_db()["accessibility_settings"]

def get_quizzes_collection():
    return get_mongo_db()["quizzes"]

def get_mentorship_groups_collection():
    return get_mongo_db()["mentorship_groups"]

# Helper functions to convert between Pydantic models and MongoDB documents
def user_to_dict(user: UserDocument) -> Dict[str, Any]:
    """Convert UserDocument to MongoDB document dict"""
    doc = user.model_dump(by_alias=False, exclude_none=True)
    # Keep both id and _id for MongoDB compatibility
    if "id" in doc and "_id" not in doc:
        doc["_id"] = doc["id"]
    return doc

def dict_to_user(doc: Dict[str, Any]) -> UserDocument:
    """Convert MongoDB document to UserDocument"""
    # MongoDB uses _id, but our model uses id with alias
    if "_id" in doc and "id" not in doc:
        doc["id"] = str(doc["_id"])
    return UserDocument(**doc)

# Similar helpers for other models
def course_to_dict(course: CourseDocument) -> Dict[str, Any]:
    doc = course.model_dump(by_alias=True, exclude_none=True)
    if "_id" in doc:
        doc["_id"] = doc["_id"]
    return doc

def dict_to_course(doc: Dict[str, Any]) -> CourseDocument:
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return CourseDocument(**doc)

