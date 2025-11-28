# backend_python/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from backend_python.database import get_db
from backend_python.models import User, UserRole
from backend_python.schemas import UserResponse, UserCreate
from backend_python.auth_utils import get_current_user, get_password_hash

router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        id=str(uuid4()),
        email=payload.email,
        name=payload.name,
        role=UserRole(payload.role) if payload.role in UserRole.__members__ or payload.role in [r.value for r in UserRole] else UserRole.learner,
        password_hash=get_password_hash(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserResponse.from_orm(user)

@router.get("api/users/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if str(current_user.id) != str(user_id) and current_user.role != UserRole.administrator:
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(User).filter(User.id == str(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.from_orm(user)
