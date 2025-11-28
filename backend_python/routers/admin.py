from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend_python.database import get_db
from backend_python.models import User, Course, UserRole
from backend_python.schemas import UserResponse, CourseResponse
from backend_python.auth_utils import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.administrator.value:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    users = db.query(User).all()
    return [UserResponse.model_validate(user) for user in users]

@router.get("/courses", response_model=List[CourseResponse])
def get_all_courses(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    courses = db.query(Course).all()
    return [CourseResponse.model_validate(course) for course in courses]