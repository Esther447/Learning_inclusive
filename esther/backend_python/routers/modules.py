from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from backend_python.database import get_db
from backend_python.models import Module, Lesson
from backend_python.schemas import ModuleResponse, LessonResponse

router = APIRouter()

@router.get("/courses/{course_id}/modules", response_model=List[ModuleResponse])
def get_course_modules(course_id: UUID, db: Session = Depends(get_db)):
    modules = db.query(Module).filter(Module.course_id == str(course_id)).order_by(Module.order_index).all()
    return modules

@router.get("/modules/{module_id}/lessons", response_model=List[LessonResponse])
def get_module_lessons(module_id: UUID, db: Session = Depends(get_db)):
    lessons = db.query(Lesson).filter(Lesson.module_id == str(module_id)).order_by(Lesson.order_index).all()
    return lessons
