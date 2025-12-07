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
    id: UUID
    email: str
    name: str | None
    role: str
    created_at: datetime

@router.post("/login", response_model=TokenOut)
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
        
        if not verify_password(payload.password, user_doc["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        access_token = create_access_token(str(user_doc["_id"]))
        refresh_token = create_refresh_token(str(user_doc["_id"]))

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
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
        
        user_data = {
            "_id": user_id,
            "email": normalized_email,
            "password_hash": hashed_password,
            "name": payload.name,
            "role": UserRole.LEARNER.value,
            "created_at": datetime.utcnow()
        }
        
        await users_collection.insert_one(user_data)
        
        return {
            "id": user_id,
            "email": normalized_email,
            "name": payload.name,
            "role": UserRole.LEARNER.value,
            "created_at": user_data["created_at"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )