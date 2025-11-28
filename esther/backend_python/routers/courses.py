# backend_python/routers/courses.py
from fastapi import APIRouter, Depends, HTTPException, Path, UploadFile, File, Query, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import List, Optional
import os

from backend_python.database import get_db
from backend_python.models import Course, User
from backend_python.schemas import CourseCreate, CourseResponse
from backend_python.auth_utils import get_current_user

router = APIRouter()

@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Only mentors or admins should create in production - for now allow instructor assignment
    course = Course(
        id=str(uuid4()),
        title=payload.title,
        description=payload.description,
        category=payload.category,
        difficulty=payload.difficulty,
        instructor_id=str(current_user.id),
        accessibility_features=payload.accessibility_features,
        sign_language_video_url=str(payload.sign_language_video_url) if payload.sign_language_video_url else None,
        transcript_url=str(payload.transcript_url) if payload.transcript_url else None
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return CourseResponse.from_orm(course)

@router.get("/", response_model=List[CourseResponse])
def list_courses(category: Optional[str] = Query(None), difficulty: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Course)
    if category:
        q = q.filter(Course.category == category)
    if difficulty:
        q = q.filter(Course.difficulty == difficulty)
    courses = q.all()
    return [CourseResponse.from_orm(c) for c in courses]

@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: UUID = Path(...), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == str(course_id)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseResponse.from_orm(course)

@router.post("/{course_id}/captions")
def upload_captions(course_id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == str(course_id)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if str(course.instructor_id) != str(current_user.id) and current_user.role != User.__table__.c.get('role'):
        # loose check; adjust role checks as needed
        pass
    os.makedirs("media/captions", exist_ok=True)
    filename = f"{course_id}_{file.filename}"
    path = os.path.join("media/captions", filename)
    with open(path, "wb") as f:
        f.write(file.file.read())
    meta = course.captions or []
    meta.append({"filename": file.filename, "url": f"/media/captions/{filename}"})
    course.captions = meta
    db.commit()
    return {"detail": "captions uploaded", "captions": meta}
