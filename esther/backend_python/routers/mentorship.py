# backend_python/routers/mentorship.py
from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from uuid import uuid4

from backend_python.database import get_db
from backend_python.models import MentorshipGroup, MentorshipMembership, User
from backend_python.schemas import MentorshipGroupCreate, MentorshipGroupOut
from backend_python.auth_utils import get_current_user

router = APIRouter()

@router.get("/groups", response_model=List[MentorshipGroupOut])
def list_groups(db: Session = Depends(get_db)):
    groups = db.query(MentorshipGroup).all()
    return [MentorshipGroupOut(id=g.id, title=g.title, description=g.description, mentor_id=g.mentor_id) for g in groups]

@router.post("/groups", response_model=MentorshipGroupOut, status_code=status.HTTP_201_CREATED)
def create_group(payload: MentorshipGroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    g = MentorshipGroup(id=str(uuid4()), title=payload.title, description=payload.description, mentor_id=str(current_user.id))
    db.add(g)
    db.commit()
    db.refresh(g)
    return MentorshipGroupOut(id=g.id, title=g.title, description=g.description, mentor_id=g.mentor_id)

@router.post("/groups/{group_id}/join", status_code=status.HTTP_201_CREATED)
def join_group(group_id: UUID = Path(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    g = db.query(MentorshipGroup).filter(MentorshipGroup.id == str(group_id)).first()
    if not g:
        raise HTTPException(status_code=404, detail="Group not found")
    existing = db.query(MentorshipMembership).filter(MentorshipMembership.group_id == str(group_id), MentorshipMembership.user_id == str(current_user.id)).first()
    if existing:
        return {"detail": "Already a member"}
    m = MentorshipMembership(id=str(uuid4()), group_id=str(group_id), user_id=str(current_user.id))
    db.add(m)
    db.commit()
    db.refresh(m)
    return {"detail": "Joined", "membership_id": str(m.id)}
