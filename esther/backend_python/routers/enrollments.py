# backend_python/routers/enrollments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from backend_python.database import get_db
from backend_python.models import Enrollment, Course, User
from backend_python.schemas import EnrollmentOut
from backend_python.auth_utils import get_current_user

router = APIRouter()

@router.post("/{course_id}", response_model=EnrollmentOut, status_code=status.HTTP_201_CREATED)
def enroll(course_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == str(course_id)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    existing = db.query(Enrollment).filter(Enrollment.course_id == str(course_id), Enrollment.user_id == str(current_user.id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    enrollment = Enrollment(id=str(uuid4()), user_id=str(current_user.id), course_id=str(course_id))
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return EnrollmentOut.model_validate(enrollment)

@router.get("/me", response_model=list[EnrollmentOut])
def my_enrollments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = db.query(Enrollment).filter(Enrollment.user_id == str(current_user.id)).all()
    return [EnrollmentOut.model_validate(r) for r in rows]
