# mongodb_models.py
"""
MongoDB document models for complex/nested data
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class QuizScoreDocument(BaseModel):
    quiz_id: str
    score: float
    max_score: float
    completed_at: datetime

class LearnerProgressDocument(BaseModel):
    learner_id: str
    course_id: str
    module_id: str
    completion_percentage: float = Field(0.0, ge=0.0, le=100.0)
    completed: bool = False
    time_spent: int = 0  # in minutes
    last_accessed: datetime
    quiz_scores: List[QuizScoreDocument] = []
    notes: Optional[str] = None

class CourseModuleDocument(BaseModel):
    module_id: str
    title: str
    description: str
    order: int
    estimated_time: int  # in minutes
    content_type: str  # text, video, audio, interactive, quiz
    content_url: Optional[str] = None
    transcript: Optional[str] = None
    captions: Optional[str] = None
    alt_text: Optional[str] = None

class AccessibilitySettingsDocument(BaseModel):
    user_id: str
    screen_reader_enabled: bool = False
    text_to_speech_enabled: bool = False
    high_contrast_mode: bool = False
    font_size: str = "medium"  # small, medium, large, extra-large
    color_theme: str = "default"  # default, high-contrast, dark, light
    captions_enabled: bool = True
    transcripts_enabled: bool = True
    sign_language_enabled: bool = False
    volume_boost: int = Field(0, ge=0, le=100)
    reading_speed: str = "normal"  # slow, normal, fast
    created_at: datetime
    updated_at: datetime

class MentorshipGroupDocument(BaseModel):
    name: str
    description: Optional[str] = None
    mentor_id: str
    learner_ids: List[str] = []
    meeting_schedule: Optional[str] = None
    created_at: datetime
    updated_at: datetime