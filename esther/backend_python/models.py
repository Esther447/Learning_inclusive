# backend_python/models.py
import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Text, JSON, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from .database import Base

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
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    # store role as a plain string to avoid DB enum label mismatches
    role = Column(String(50), nullable=False, default=UserRole.learner.value)
    created_at = Column(DateTime, default=datetime.utcnow)
    full_name = Column(String, nullable=False)

    accessibility_settings = relationship("AccessibilitySettings", back_populates="user", uselist=False)
    progress_entries = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    mentorship_groups = relationship("MentorshipGroup", back_populates="mentor")
    mentorship_memberships = relationship("MentorshipMembership", back_populates="user", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")

# ==================== Course Model ====================
class Course(Base):
    __tablename__ = "courses"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    # store category and difficulty as strings for cross-DB compatibility
    category = Column(String(50), nullable=False, default=CourseCategory.general.value)
    difficulty = Column(String(50), nullable=False, default=CourseDifficulty.beginner.value)
    instructor_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    accessibility_features = Column(JSON, nullable=True)
    captions = Column(JSON, nullable=True)
    transcript = Column(Text, nullable=True)
    sign_language_video_url = Column(String, nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress_entries = relationship("Progress", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="course", cascade="all, delete-orphan")

# ==================== Enrollment Model ====================
class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(PG_UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

# ==================== Accessibility Settings ====================
class AccessibilitySettings(Base):
    __tablename__ = "accessibility_settings"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="accessibility_settings")

# ==================== Progress Model ====================
class Progress(Base):
    __tablename__ = "progress"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(PG_UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    progress_data = Column(JSON, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress_entries")
    course = relationship("Course", back_populates="progress_entries")

# ==================== Mentorship Models ====================
class MentorshipGroup(Base):
    __tablename__ = "mentorship_groups"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    mentor_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mentor = relationship("User", back_populates="mentorship_groups")
    memberships = relationship("MentorshipMembership", back_populates="group", cascade="all, delete-orphan")

class MentorshipMembership(Base):
    __tablename__ = "mentorship_memberships"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id = Column(PG_UUID(as_uuid=True), ForeignKey("mentorship_groups.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    group = relationship("MentorshipGroup", back_populates="memberships")
    user = relationship("User", back_populates="mentorship_memberships")

# ==================== Quiz Models ====================
class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(PG_UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    score = Column(Integer, nullable=True)

    course = relationship("Course", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(PG_UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)
    correct_answer = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    quiz = relationship("Quiz", back_populates="questions")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(PG_UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    answers = Column(JSON, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    score = Column(Integer, nullable=True)

    user = relationship("User")
    quiz = relationship("Quiz")
