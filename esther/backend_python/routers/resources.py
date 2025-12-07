from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from backend_python.database import get_db
from backend_python.models import Resource
from backend_python.schemas import ResourceCreate, ResourceResponse

router = APIRouter()

@router.get("/courses/{course_id}/resources", response_model=List[ResourceResponse])
def get_course_resources(course_id: UUID, db: Session = Depends(get_db)):
    resources = db.query(Resource).filter(Resource.course_id == str(course_id)).all()
    return resources

@router.get("/modules/{module_id}/resources", response_model=List[ResourceResponse])
def get_module_resources(module_id: UUID, db: Session = Depends(get_db)):
    resources = db.query(Resource).filter(Resource.module_id == str(module_id)).all()
    return resources

@router.get("/lessons/{lesson_id}/resources", response_model=List[ResourceResponse])
def get_lesson_resources(lesson_id: UUID, db: Session = Depends(get_db)):
    resources = db.query(Resource).filter(Resource.lesson_id == str(lesson_id)).all()
    return resources

@router.post("/resources", response_model=ResourceResponse)
def create_resource(payload: ResourceCreate, db: Session = Depends(get_db)):
    resource = Resource(**payload.dict())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource
