from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from backend_python.database import get_db
from backend_python.models import Assignment
from backend_python.schemas import AssignmentCreate, AssignmentResponse
from backend_python.auth_utils import get_current_user
from backend_python.models import User

router = APIRouter()

@router.get("/courses/{course_id}/assignments", response_model=List[AssignmentResponse])
def get_course_assignments(course_id: UUID, db: Session = Depends(get_db)):
    assignments = db.query(Assignment).filter(Assignment.course_id == str(course_id)).all()
    return assignments

@router.post("/assignments", response_model=AssignmentResponse)
def create_assignment(payload: AssignmentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    assignment = Assignment(**payload.dict())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

@router.get("/assignments/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: UUID, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == str(assignment_id)).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment
