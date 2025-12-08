# routers/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr, Field
from uuid import uuid4, UUID
from datetime import datetime
from typing import Optional

from backend_python.mongodb_db import get_users_collection
from backend_python.mongodb_models import UserRole
from backend_python.auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)

router = APIRouter()

class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str | None = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None
    role: str
    created_at: datetime

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshIn(BaseModel):
    refresh_token: str


class RefreshOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginIn):
    users_collection = get_users_collection()
    
    try:
        normalized_email = payload.email.lower().strip()
        user_doc = await users_collection.find_one(
            {"email": {"$regex": f"^{normalized_email}$", "$options": "i"}}
        )
        
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify password hash exists and matches
        password_hash = user_doc.get("password_hash")
        if not password_hash or not verify_password(payload.password, password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        access_token = create_access_token(str(user_doc["_id"]))
        refresh_token = create_refresh_token(str(user_doc["_id"]))

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user_doc["_id"]),
                "email": user_doc.get("email"),
                "name": user_doc.get("name"),
                "role": user_doc.get("role", "learner"),
                "created_at": user_doc.get("created_at", datetime.utcnow())
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/signup", response_model=UserResponse)
async def signup(payload: SignupIn):
    users_collection = get_users_collection()
    
    try:
        normalized_email = payload.email.lower().strip()
        existing = await users_collection.find_one(
            {"email": {"$regex": f"^{normalized_email}$", "$options": "i"}}
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        user_id = str(uuid4())
        hashed_password = get_password_hash(payload.password)
        
        now = datetime.utcnow()
        user_data = {
            "_id": user_id,
            "email": normalized_email,
            "password_hash": hashed_password,
            "name": payload.name,
            "role": UserRole.LEARNER.value,
            "created_at": now
        }
        
        await users_collection.insert_one(user_data)
        
        return {
            "id": user_id,
            "email": normalized_email,
            "name": payload.name,
            "role": UserRole.LEARNER.value,
            "created_at": now
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/refresh", response_model=RefreshOut)
async def refresh_token(payload: RefreshIn):
    """Exchange a valid refresh token for a new access token (and rotate refresh token)."""
    try:
        token_payload = decode_token(payload.refresh_token, refresh=True)
        if not token_payload or token_payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        user_id = token_payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

        users_collection = get_users_collection()
        user_doc = await users_collection.find_one({"_id": user_id})
        if not user_doc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        new_access = create_access_token(str(user_id))
        new_refresh = create_refresh_token(str(user_id))

        return {
            "access_token": new_access,
            "refresh_token": new_refresh,
            "token_type": "bearer"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Refresh token error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")