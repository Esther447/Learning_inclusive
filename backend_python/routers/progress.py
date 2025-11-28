# backend_python/routers/progress.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend_python.database import get_db
from backend_python.auth_utils import get_current_user
from backend_python.models import Progress, User
from backend_python.schemas import ProgressIn, ProgressOut

router = APIRouter()

@router.get("/", response_model=List[ProgressOut])
def list_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = db.query(Progress).filter(Progress.user_id == str(current_user.id)).all()
    return [ProgressOut(user_id=r.user_id, course_id=r.course_id, progress_data=r.progress_data or {}) for r in rows]

@router.put("/", response_model=ProgressOut)
def update_progress(payload: ProgressIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Progress).filter(Progress.user_id == str(current_user.id), Progress.course_id == str(payload.course_id)).first()
    if not existing:
        existing = Progress(user_id=str(current_user.id), course_id=str(payload.course_id), progress_data=payload.progress_data)
        db.add(existing)
    else:
        existing.progress_data = payload.progress_data
    db.commit()
    db.refresh(existing)
    return ProgressOut(user_id=existing.user_id, course_id=existing.course_id, progress_data=existing.progress_data or {})
