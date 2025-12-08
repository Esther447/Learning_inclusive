# backend_python/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List
from pydantic import BaseModel
from uuid import UUID
from backend_python.mongodb_db import (
    get_users_collection, get_courses_collection,
    get_enrollments_collection, get_progress_collection
)
from backend_python.auth_utils import get_current_user
from backend_python.mongodb_models import UserDocument, UserRole
from backend_python.schemas import UserResponse
from backend_python.dependencies import require_role

router = APIRouter()

class UpdateUserRole(BaseModel):
    role: str

@router.get("/stats")
async def get_platform_stats(current_user: UserDocument = Depends(require_role(["administrator"]))):
    """Get platform statistics - admin only"""
    users_collection = get_users_collection()
    courses_collection = get_courses_collection()
    enrollments_collection = get_enrollments_collection()
    progress_collection = get_progress_collection()
    
    total_users = await users_collection.count_documents({})
    total_courses = await courses_collection.count_documents({})
    total_enrollments = await enrollments_collection.count_documents({})
    total_progress_entries = await progress_collection.count_documents({})

    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_progress_entries": total_progress_entries
    }

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: UserDocument = Depends(require_role(["administrator"]))):
    """Get all users - admin only"""
    users_collection = get_users_collection()
    cursor = users_collection.find({})
    users = []
    async for doc in cursor:
        users.append(UserResponse(
            id=UUID(doc.get("_id")),
            email=doc.get("email"),
            name=doc.get("name"),
            role=doc.get("role", "learner"),
            created_at=doc.get("created_at")
        ))
    return users

@router.patch("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    payload: UpdateUserRole = Body(...),
    current_user: UserDocument = Depends(require_role(["administrator"]))
):
    """Update user role - admin only"""
    # Validate role
    valid_roles = [role.value for role in UserRole]
    if payload.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")
    
    users_collection = get_users_collection()
    
    # Check if user exists
    user_doc = await users_collection.find_one({"_id": user_id})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update role
    await users_collection.update_one(
        {"_id": user_id},
        {"$set": {"role": payload.role}}
    )
    
    # Fetch updated user
    updated_doc = await users_collection.find_one({"_id": user_id})
    
    return UserResponse(
        id=UUID(updated_doc.get("_id")),
        email=updated_doc.get("email"),
        name=updated_doc.get("name"),
        role=updated_doc.get("role", "learner"),
        created_at=updated_user.created_at
    )
