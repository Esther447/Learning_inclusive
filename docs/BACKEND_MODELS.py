# Enhanced Backend Models for Full LMS
# Add these to your existing models.py

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Boolean, Integer, DECIMAL, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

# ==================== Category Model ====================
class Category(Base):
    __tablename__ = "categories"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(255), nullable=True)
    parent_id = Column(UUIDType, ForeignKey("categories.id"), nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    courses = relationship("Course", back_populates="category")
    parent = relationship("Category", remote_side=[id], backref="subcategories")

# ==================== Enhanced Course Model ====================
class Course(Base):
    __tablename__ = "courses"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(UUIDType, ForeignKey("categories.id"), nullable=True)
    instructor_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    cover_image = Column(String(500), nullable=True)
    difficulty = Column(String(50), default="beginner")
    duration_hours = Column(Integer, nullable=True)
    prerequisites = Column(ARRAY(Text), nullable=True)
    learning_outcomes = Column(JSON, nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    is_published = Column(Boolean, default=False)
    enrollment_count = Column(Integer, default=0)
    average_rating = Column(DECIMAL(3, 2), nullable=True)
    accessibility_features = Column(JSON, nullable=True)
    sign_language_video_url = Column(String(500), nullable=True)
    transcript = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="courses")
    instructor = relationship("User", foreign_keys=[instructor_id])
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="course", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="course", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="course", cascade="all, delete-orphan")
    discussions = relationship("Discussion", back_populates="course", cascade="all, delete-orphan")
    pages = relationship("Page", back_populates="course", cascade="all, delete-orphan")
    reviews = relationship("CourseReview", back_populates="course", cascade="all, delete-orphan")

# ==================== Module Model ====================
class Module(Base):
    __tablename__ = "modules"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False)
    learning_objectives = Column(ARRAY(Text), nullable=True)
    duration_mins = Column(Integer, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")
    resources = relationship("Resource", back_populates="module", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="module")
    quizzes = relationship("Quiz", back_populates="module")

# ==================== Lesson Model ====================
class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    module_id = Column(UUIDType, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    lesson_type = Column(String(50), nullable=False)  # video, article, interactive, pdf, external
    content = Column(Text, nullable=True)
    video_url = Column(String(500), nullable=True)
    duration_mins = Column(Integer, nullable=True)
    order_index = Column(Integer, nullable=False)
    is_free_preview = Column(Boolean, default=False)
    accessibility_content = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    module = relationship("Module", back_populates="lessons")
    resources = relationship("Resource", back_populates="lesson", cascade="all, delete-orphan")
    progress_entries = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")

# ==================== Resource Model ====================
class Resource(Base):
    __tablename__ = "resources"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    lesson_id = Column(UUIDType, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=True)
    module_id = Column(UUIDType, ForeignKey("modules.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    resource_type = Column(String(50), nullable=True)  # pdf, doc, video, link, image
    file_url = Column(String(500), nullable=True)
    external_link = Column(String(500), nullable=True)
    file_size = Column(Integer, nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    lesson = relationship("Lesson", back_populates="resources")
    module = relationship("Module", back_populates="resources")

# ==================== Lesson Progress Model ====================
class LessonProgress(Base):
    __tablename__ = "lesson_progress"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUIDType, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    completed = Column(Boolean, default=False)
    time_spent_seconds = Column(Integer, default=0)
    last_position_seconds = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User")
    lesson = relationship("Lesson", back_populates="progress_entries")

# ==================== Assignment Model ====================
class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(UUIDType, ForeignKey("modules.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    points = Column(Integer, default=100)
    submission_type = Column(String(50), nullable=True)  # file, text, url, none
    allowed_file_types = Column(ARRAY(String), nullable=True)
    max_file_size = Column(Integer, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course", back_populates="assignments")
    module = relationship("Module", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")

# ==================== Submission Model ====================
class Submission(Base):
    __tablename__ = "submissions"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    assignment_id = Column(UUIDType, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    grade = Column(DECIMAL(5, 2), nullable=True)
    feedback = Column(Text, nullable=True)
    graded_by = Column(UUIDType, ForeignKey("users.id"), nullable=True)
    graded_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="submitted")
    attempt_number = Column(Integer, default=1)
    
    assignment = relationship("Assignment", back_populates="submissions")
    user = relationship("User", foreign_keys=[user_id])
    grader = relationship("User", foreign_keys=[graded_by])

# ==================== Enhanced Quiz Model ====================
class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    module_id = Column(UUIDType, ForeignKey("modules.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    time_limit_minutes = Column(Integer, nullable=True)
    passing_score = Column(DECIMAL(5, 2), default=70)
    attempts_allowed = Column(Integer, default=1)
    show_correct_answers = Column(Boolean, default=True)
    shuffle_questions = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course", back_populates="quizzes")
    module = relationship("Module", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

# ==================== Enhanced Question Model ====================
class Question(Base):
    __tablename__ = "questions"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUIDType, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=True)  # multiple_choice, true_false, short_answer, essay
    options = Column(JSON, nullable=True)
    correct_answer = Column(Text, nullable=True)
    points = Column(Integer, default=1)
    explanation = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    quiz = relationship("Quiz", back_populates="questions")

# ==================== Quiz Attempt Model ====================
class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUIDType, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    answers = Column(JSON, nullable=True)
    score = Column(DECIMAL(5, 2), nullable=True)
    max_score = Column(Integer, nullable=True)
    percentage = Column(DECIMAL(5, 2), nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    time_taken_seconds = Column(Integer, nullable=True)
    attempt_number = Column(Integer, default=1)
    
    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User")

# ==================== Grade Model ====================
class Grade(Base):
    __tablename__ = "grades"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    assignment_id = Column(UUIDType, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=True)
    quiz_id = Column(UUIDType, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=True)
    score = Column(DECIMAL(5, 2), nullable=False)
    max_score = Column(DECIMAL(5, 2), nullable=False)
    percentage = Column(DECIMAL(5, 2), nullable=True)
    letter_grade = Column(String(5), nullable=True)
    graded_by = Column(UUIDType, ForeignKey("users.id"), nullable=True)
    graded_at = Column(DateTime, default=datetime.utcnow)
    feedback = Column(Text, nullable=True)
    
    user = relationship("User", foreign_keys=[user_id])
    course = relationship("Course")
    grader = relationship("User", foreign_keys=[graded_by])

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
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    course = relationship("Course", back_populates="announcements")
    author = relationship("User")

# ==================== Discussion Model ====================
class Discussion(Base):
    __tablename__ = "discussions"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False)
    is_locked = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)
    replies_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    course = relationship("Course", back_populates="discussions")
    user = relationship("User")
    replies = relationship("DiscussionReply", back_populates="discussion", cascade="all, delete-orphan")

# ==================== Discussion Reply Model ====================
class DiscussionReply(Base):
    __tablename__ = "discussion_replies"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    discussion_id = Column(UUIDType, ForeignKey("discussions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    parent_reply_id = Column(UUIDType, ForeignKey("discussion_replies.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    discussion = relationship("Discussion", back_populates="replies")
    user = relationship("User")
    parent = relationship("DiscussionReply", remote_side=[id], backref="child_replies")

# ==================== Certificate Model ====================
class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)
    certificate_url = Column(String(500), nullable=True)
    verification_code = Column(String(100), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    
    user = relationship("User")
    course = relationship("Course")

# ==================== Notification Model ====================
class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=True)  # announcement, assignment, grade, discussion, system
    related_id = Column(UUIDType, nullable=True)
    related_type = Column(String(50), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")

# ==================== Calendar Event Model ====================
class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String(50), nullable=True)  # assignment, quiz, live_session, deadline
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    location = Column(String(500), nullable=True)
    is_all_day = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    course = relationship("Course")

# ==================== Page Model ====================
class Page(Base):
    __tablename__ = "pages"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    slug = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    course = relationship("Course", back_populates="pages")

# ==================== Course Review Model ====================
class CourseReview(Base):
    __tablename__ = "course_reviews"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    course_id = Column(UUIDType, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    review_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    course = relationship("Course", back_populates="reviews")
    user = relationship("User")

# ==================== Badge Model ====================
class Badge(Base):
    __tablename__ = "badges"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    criteria = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_badges = relationship("UserBadge", back_populates="badge")

# ==================== User Badge Model ====================
class UserBadge(Base):
    __tablename__ = "user_badges"
    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    badge_id = Column(UUIDType, ForeignKey("badges.id", ondelete="CASCADE"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    badge = relationship("Badge", back_populates="user_badges")
