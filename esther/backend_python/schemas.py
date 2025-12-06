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
    id: str
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
    learning_outcomes: Optional[List[str]] = []
    prerequisites: Optional[List[str]] = []
    duration_hours: Optional[int] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = []
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
    learning_outcomes: Optional[List[str]] = []
    prerequisites: Optional[List[str]] = []
    duration_hours: Optional[int] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = []
    accessibility_features: Optional[Dict] = {}
    captions: Optional[List[Dict]] = []
    transcript_url: Optional[str] = None
    sign_language_video_url: Optional[str] = None
    is_published: bool
    created_at: Optional[datetime] = None

# === Enrollment ===
class EnrollmentOut(CamelModel):
    id: UUID
    user_id: UUID
    course_id: UUID
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
class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
    
    class Config:
        from_attributes = True

# === Modules ===
class ModuleCreate(CamelModel):
    course_id: UUID
    title: str
    description: Optional[str] = None
    order_index: int

class ModuleResponse(CamelModel):
    id: UUID
    course_id: UUID
    title: str
    description: Optional[str]
    order_index: int
    created_at: Optional[datetime]

# === Lessons ===
class LessonCreate(CamelModel):
    module_id: UUID
    title: str
    lesson_type: str
    content: Optional[str] = None
    video_url: Optional[str] = None
    resource_links: Optional[List[str]] = []
    downloadable_files: Optional[List[str]] = []
    order_index: int

class LessonResponse(CamelModel):
    id: UUID
    module_id: UUID
    title: str
    lesson_type: str
    content: Optional[str]
    video_url: Optional[str]
    resource_links: Optional[List[str]] = []
    downloadable_files: Optional[List[str]] = []
    order_index: int
    created_at: Optional[datetime]

class LessonProgressUpdate(CamelModel):
    lesson_id: UUID
    completed: bool

# === Resources ===
class ResourceCreate(CamelModel):
    title: str
    description: Optional[str] = None
    resource_type: Optional[str] = None
    file_url: Optional[str] = None
    course_id: Optional[UUID] = None
    module_id: Optional[UUID] = None
    lesson_id: Optional[UUID] = None

class ResourceResponse(CamelModel):
    id: UUID
    title: str
    description: Optional[str]
    resource_type: Optional[str]
    file_url: Optional[str]
    course_id: Optional[UUID]
    module_id: Optional[UUID]
    lesson_id: Optional[UUID]
    created_at: Optional[datetime]

# === Assignments ===
class AssignmentCreate(CamelModel):
    course_id: UUID
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    points: int = 100

class AssignmentResponse(CamelModel):
    id: UUID
    course_id: UUID
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    points: int
    created_at: Optional[datetime]

# === Announcements ===
class AnnouncementCreate(CamelModel):
    course_id: UUID
    title: str
    content: str
    is_pinned: bool = False

class AnnouncementResponse(CamelModel):
    id: UUID
    course_id: UUID
    author_id: UUID
    title: str
    content: str
    is_pinned: bool
    created_at: Optional[datetime]

# === Discussions ===
class DiscussionCreate(CamelModel):
    course_id: UUID
    title: str
    content: str

class DiscussionResponse(CamelModel):
    id: UUID
    course_id: UUID
    user_id: UUID
    title: str
    content: str
    created_at: Optional[datetime]

# === Pages ===
class PageCreate(CamelModel):
    course_id: UUID
    title: str
    content: Optional[str] = None
    slug: Optional[str] = None
    order_index: int = 0

class PageResponse(CamelModel):
    id: UUID
    course_id: UUID
    title: str
    content: Optional[str]
    slug: Optional[str]
    order_index: int
    created_at: Optional[datetime]
