from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field, constr
from uuid import uuid4

from backend_python.database import get_db
from backend_python.models import User, UserRole
from backend_python.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from backend_python.schemas import UserResponse

router = APIRouter()


# ==================== Request Schemas ====================

class SignupIn(BaseModel):
    email: EmailStr
    password: constr(min_length=6) 
    name: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


# ==================== AUTH ROUTES ====================

@router.post("/signup", response_model=UserResponse)
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Assign default role (Enum)
    role_to_use = UserRole.learner.value

    # Create user
    user = User(
        id=uuid4(),
        email=payload.email,
        name=payload.name,
        role=role_to_use,
        password_hash=get_password_hash(payload.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return UserResponse.from_orm(user)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))

    return TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse.from_orm(user)
    )


@router.post("/refresh", response_model=TokenOut)
def refresh_token(payload: RefreshIn = Body(...), db: Session = Depends(get_db)):
    decoded = decode_token(payload.refresh_token, refresh=True)

    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    sub = decoded.get("sub")
    user = db.query(User).filter(User.id == sub).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))

    return TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=UserResponse.from_orm(user)
    )
