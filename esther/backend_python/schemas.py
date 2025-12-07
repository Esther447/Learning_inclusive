# backend_python/schemas.py
from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Optional, List, Dict
from uuid import UUID
from datetime import datetime

def to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])

class CamelModel(BaseModel):
    class Config:
        from_attributes = True
        alias_generator = to_camel
        populate_by_name = True

# === Users ===
class UserResponse(CamelModel):
    id: UUID
    email: EmailStr
    name: Optional[str] = None
    role: Optional[str] = "learner"
    created_at: Optional[datetime] = None

class UserCreate(CamelModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: Optional[str] = None
    role: Optional[str] = "learner"

# === Courses ===
class CourseCreate(CamelModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "general"
    difficulty: Optional[str] = "beginner"
    accessibility_features: Optional[Dict] = {}
    sign_language_video_url: Optional[HttpUrl] = None
    transcript_url: Optional[HttpUrl] = None

class CourseResponse(CamelModel):
    id: UUID
    title: str
    description: Optional[str]
    category: str
    difficulty: str
    instructor_id: UUID
    accessibility_features: Optional[Dict] = {}
    captions: Optional[List[Dict]] = []
    transcript_url: Optional[str] = None
    sign_language_video_url: Optional[str] = None
    is_published: bool

# === Enrollment ===
class EnrollmentOut(CamelModel):
    id: str  # MongoDB uses string IDs
    user_id: str
    course_id: str
    enrolled_at: Optional[datetime]

# === Progress ===
class ProgressIn(CamelModel):
    course_id: UUID
    progress_data: Dict

class ProgressOut(CamelModel):
    user_id: UUID
    course_id: UUID
    progress_data: Dict

# === Accessibility ===
class AccessibilitySettingsIn(CamelModel):
    settings: Dict = {}

class AccessibilitySettingsOut(CamelModel):
    user_id: UUID
    settings: Dict

# === Mentorship ===
class MentorshipGroupCreate(CamelModel):
    title: str
    description: Optional[str] = None

class MentorshipGroupOut(CamelModel):
    id: UUID
    title: str
    description: Optional[str]
    mentor_id: Optional[UUID]

# === Quizzes ===
class QuizCreate(CamelModel):
    course_id: UUID
    title: str
    description: Optional[str] = None

class QuizOut(CamelModel):
    id: UUID
    course_id: UUID
    title: str
    description: Optional[str]

class QuestionCreate(CamelModel):
    quiz_id: UUID
    prompt: str
    options: Optional[List[str]] = []
    answer: Optional[str] = None

class SubmissionIn(CamelModel):
    quiz_id: UUID
    answers: Dict

class SubmissionOut(CamelModel):
    id: UUID
    user_id: UUID
    quiz_id: UUID
    answers: Dict
    score: Optional[int]
    submitted_at: Optional[datetime]

# === Token ===
class TokenOut(CamelModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
