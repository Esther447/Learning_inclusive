# backend_python/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import Optional
from pydantic import BaseModel, EmailStr

from backend_python.database import get_db
from backend_python.models import User, UserRole
from backend_python.schemas import UserResponse, UserCreate
from backend_python.auth_utils import get_current_user, get_password_hash
from backend_python.mongodb_db import get_users_collection, dict_to_user

router = APIRouter()

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

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
    return UserResponse.model_validate(user)

@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    """Get current user profile from MongoDB"""
    # Convert MongoDB user dict to UserResponse
    return UserResponse(
        id=UUID(current_user["_id"]),
        email=current_user["email"],
        name=current_user.get("name"),
        role=current_user.get("role", "learner"),
        created_at=current_user.get("created_at")
    )

@router.put("/me", response_model=UserResponse)
async def update_me(payload: UserUpdate, current_user: dict = Depends(get_current_user)):
    """Update current user profile in MongoDB"""
    users_collection = get_users_collection()
    user_id = current_user["_id"]
    
    # Build update dict
    update_data = {}
    if payload.name is not None:
        update_data["name"] = payload.name.strip() if payload.name else None
    if payload.email is not None:
        # Check if email is already taken by another user
        existing = await users_collection.find_one({"email": payload.email, "_id": {"$ne": user_id}})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        update_data["email"] = payload.email
    
    if not update_data:
        # No changes, return current user
        updated_doc = await users_collection.find_one({"_id": user_id})
        return UserResponse(
            id=UUID(updated_doc["_id"]),
            email=updated_doc["email"],
            name=updated_doc.get("name"),
            role=updated_doc.get("role", "learner"),
            created_at=updated_doc.get("created_at")
        )
    
    # Update in MongoDB
    await users_collection.update_one(
        {"_id": user_id},
        {"$set": update_data}
    )
    
    # Fetch updated user
    updated_doc = await users_collection.find_one({"_id": user_id})
    return UserResponse(
        id=UUID(updated_doc["_id"]),
        email=updated_doc["email"],
        name=updated_doc.get("name"),
        role=updated_doc.get("role", "learner"),
        created_at=updated_doc.get("created_at")
    )

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if str(current_user.id) != str(user_id) and current_user.role != UserRole.administrator:
        raise HTTPException(status_code=403, detail="Not authorized")
    user = db.query(User).filter(User.id == str(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)
