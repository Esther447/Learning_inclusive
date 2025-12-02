# MongoDB Models/Schemas
# MongoDB uses document-based storage, so we define schemas as Python dicts/classes
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import uuid4
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class UserRole(str, Enum):
    learner = "learner"
    mentor = "mentor"
    administrator = "administrator"

class CourseCategory(str, Enum):
    general = "general"
    accessibility = "accessibility"

class CourseDifficulty(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

# MongoDB Document Models (as Pydantic models for validation)
class UserDocument(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    email: EmailStr
    password_hash: str
    name: Optional[str] = None
    role: UserRole = UserRole.learner
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CourseDocument(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    title: str
    description: Optional[str] = None
    category: CourseCategory = CourseCategory.general
    difficulty: CourseDifficulty = CourseDifficulty.beginner
    instructor_id: str
    accessibility_features: Optional[Dict[str, Any]] = None
    captions: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

class EnrollmentDocument(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    user_id: str
    course_id: str
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    progress: float = 0.0
    
    class Config:
        populate_by_name = True

class ProgressDocument(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    user_id: str
    course_id: str
    lesson_id: Optional[str] = None
    completed: bool = False
    progress_percentage: float = 0.0
    last_accessed: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

class AccessibilitySettingsDocument(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    user_id: str
    screen_reader_enabled: bool = False
    text_to_speech_enabled: bool = False
    high_contrast_mode: bool = False
    fontSize: str = "medium"
    color_theme: str = "default"
    
    class Config:
        populate_by_name = True

class QuizDocument(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    course_id: str
    title: str
    questions: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

class MentorshipGroupDocument(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()), alias="_id")
    name: str
    description: Optional[str] = None
    mentor_id: str
    member_ids: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

