from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from backend_python.database import get_db
from backend_python.models import Page
from backend_python.schemas import PageCreate, PageResponse

router = APIRouter()

@router.get("/courses/{course_id}/pages", response_model=List[PageResponse])
def get_course_pages(course_id: UUID, db: Session = Depends(get_db)):
    pages = db.query(Page).filter(Page.course_id == str(course_id)).order_by(Page.order_index).all()
    return pages

@router.post("/pages", response_model=PageResponse)
def create_page(payload: PageCreate, db: Session = Depends(get_db)):
    page = Page(**payload.dict())
    db.add(page)
    db.commit()
    db.refresh(page)
    return page
