from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from backend_python.database import get_db
from backend_python.models import Announcement, User
from backend_python.schemas import AnnouncementCreate, AnnouncementResponse
from backend_python.auth_utils import get_current_user

router = APIRouter()

@router.get("/courses/{course_id}/announcements", response_model=List[AnnouncementResponse])
def get_course_announcements(course_id: UUID, db: Session = Depends(get_db)):
    announcements = db.query(Announcement).filter(Announcement.course_id == str(course_id)).order_by(Announcement.created_at.desc()).all()
    return announcements

@router.post("/announcements", response_model=AnnouncementResponse)
def create_announcement(payload: AnnouncementCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    announcement = Announcement(**payload.dict(), author_id=str(current_user.id))
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement
