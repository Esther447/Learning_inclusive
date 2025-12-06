from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from backend_python.database import get_db
from backend_python.models import Discussion, User
from backend_python.schemas import DiscussionCreate, DiscussionResponse
from backend_python.auth_utils import get_current_user

router = APIRouter()

@router.get("/courses/{course_id}/discussions", response_model=List[DiscussionResponse])
def get_course_discussions(course_id: UUID, db: Session = Depends(get_db)):
    discussions = db.query(Discussion).filter(Discussion.course_id == str(course_id)).order_by(Discussion.created_at.desc()).all()
    return discussions

@router.post("/discussions", response_model=DiscussionResponse)
def create_discussion(payload: DiscussionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    discussion = Discussion(**payload.dict(), user_id=str(current_user.id))
    db.add(discussion)
    db.commit()
    db.refresh(discussion)
    return discussion
