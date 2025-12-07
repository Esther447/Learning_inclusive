# backend_python/models.py
import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Text, JSON, Boolean, Integer, TypeDecorator
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from .database import Base

# UUID type that works with both PostgreSQL and SQLite
class GUID(TypeDecorator):
    """Platform-independent GUID type."""
    impl = String
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID())
        else:
            return dialect.type_descriptor(String(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(value)
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            return value

# Use GUID for cross-database compatibility (works with both PostgreSQL and SQLite)
UUIDType = GUID

# ==================== Enums ====================
class UserRole(enum.Enum):
    learner = "learner"
    mentor = "mentor"
    administrator = "administrator"

class CourseCategory(enum.Enum):
    general = "general"
    accessibility = "accessibility"

class CourseDifficulty(enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

# ==================== User Model ====================
class User(Base):
    __tablename__ = "users"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    # store role as a plain string to avoid DB enum label mismatches
    role = Column(String(50), nullable=False, default=UserRole.learner.value)
    created_at = Column(DateTime, default=datetime.utcnow)
    # 'name' is used across the app and in frontend payloads, use same column name
    name = Column(String, nullable=True)

    accessibility_settings = relationship("AccessibilitySettings", back_populates="user", uselist=False)
    progress_entries = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    mentorship_groups = relationship("MentorshipGroup", back_populates="mentor")
    mentorship_memberships = relationship("MentorshipMembership", back_populates="user", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")

# ==================== Course Model ====================
class Course(Base):
    __tablename__ = "courses"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    # store category and difficulty as strings for cross-DB compatibility
    category = Column(String(50), nullable=False, default=CourseCategory.general.value)
    difficulty = Column(String(50), nullable=False, default=CourseDifficulty.beginner.value)
    instructor_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    # NEW LMS FIELDS
    learning_outcomes = Column(JSON, nullable=True)  # List of learning outcomes
    prerequisites = Column(JSON, nullable=True)  # List of prerequisites
    duration_hours = Column(Integer, nullable=True)  # Course duration in hours
    cover_image = Column(String(500), nullable=True)  # Cover image URL
    tags = Column(JSON, nullable=True)  # List of tags
    # EXISTING FIELDS
    accessibility_features = Column(JSON, nullable=True)
    captions = Column(JSON, nullable=True)
    transcript = Column(Text, nullable=True)
    sign_language_video_url = Column(String, nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    progress_entries = relationship("Progress", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="course", cascade="all, delete-orphan")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")

# ==================== Enrollment Model ====================
class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

# ==================== Accessibility Settings ====================
class AccessibilitySettings(Base):
    __tablename__ = "accessibility_settings"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="accessibility_settings")

# ==================== Progress Model ====================
class Progress(Base):
    __tablename__ = "progress"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    progress_data = Column(JSON, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress_entries")
    course = relationship("Course", back_populates="progress_entries")

# ==================== Mentorship Models ====================
class MentorshipGroup(Base):
    __tablename__ = "mentorship_groups"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    mentor_id = Column(UUIDType, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mentor = relationship("User", back_populates="mentorship_groups")
    memberships = relationship("MentorshipMembership", back_populates="group", cascade="all, delete-orphan")

class MentorshipMembership(Base):
    __tablename__ = "mentorship_memberships"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    group_id = Column(UUIDType, ForeignKey("mentorship_groups.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    group = relationship("MentorshipGroup", back_populates="memberships")
    user = relationship("User", back_populates="mentorship_memberships")

# ==================== Quiz Models ====================
class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    score = Column(Integer, nullable=True)

    course = relationship("Course", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUIDType, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)
    correct_answer = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    quiz = relationship("Quiz", back_populates="questions")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUIDType, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    answers = Column(JSON, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    score = Column(Integer, nullable=True)

    user = relationship("User")
    quiz = relationship("Quiz")

# ==================== Module Model ====================
class Module(Base):
    __tablename__ = "modules"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

# ==================== Lesson Model ====================
class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    module_id = Column(UUIDType, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    lesson_type = Column(String(50), nullable=False)  # video, text, link, file
    content = Column(Text, nullable=True)
    video_url = Column(String(500), nullable=True)
    resource_links = Column(JSON, nullable=True)  # List of resource links
    downloadable_files = Column(JSON, nullable=True)  # List of file URLs
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    module = relationship("Module", back_populates="lessons")
    progress_entries = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")

# ==================== Resource Model ====================
class Resource(Base):
    __tablename__ = "resources"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    resource_type = Column(String(50), nullable=True)  # pdf, video, link, doc
    file_url = Column(String(500), nullable=True)
    # Can be linked to course, module, or lesson
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=True)
    module_id = Column(UUIDType, ForeignKey("modules.id", ondelete="CASCADE"), nullable=True)
    lesson_id = Column(UUIDType, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== Lesson Progress Model ====================
class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUIDType, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    lesson = relationship("Lesson", back_populates="progress_entries")

# ==================== Assignment Model ====================
class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    points = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== Announcement Model ====================
class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== Discussion Model ====================
class Discussion(Base):
    __tablename__ = "discussions"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# ==================== Page Model ====================
class Page(Base):
    __tablename__ = "pages"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    slug = Column(String(500), nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
