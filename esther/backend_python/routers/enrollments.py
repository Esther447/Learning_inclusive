# backend_python/routers/enrollments.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from uuid import uuid4

from backend_python.mongodb_db import get_enrollments_collection, get_courses_collection
from backend_python.mongodb_models import EnrollmentDocument
from backend_python.schemas import EnrollmentOut
from backend_python.auth_utils import get_current_user

router = APIRouter()

@router.post("/{course_id}", response_model=EnrollmentOut, status_code=status.HTTP_201_CREATED)
async def enroll(course_id: str, current_user: dict = Depends(get_current_user)):
    """Enroll current user in a course - saves to MongoDB"""
    enrollments_collection = get_enrollments_collection()
    courses_collection = get_courses_collection()
    
    # Check if course exists
    course = await courses_collection.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if already enrolled
    existing = await enrollments_collection.find_one({
        "course_id": course_id,
        "user_id": str(current_user["_id"])
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    # Create enrollment document
    enrollment_doc = {
        "_id": str(uuid4()),
        "user_id": str(current_user["_id"]),
        "course_id": course_id,
        "enrolled_at": datetime.utcnow(),
        "progress": 0.0
    }
    
    # Insert into MongoDB
    await enrollments_collection.insert_one(enrollment_doc)
    
    # Return enrollment response
    return EnrollmentOut(
        id=enrollment_doc["_id"],
        user_id=enrollment_doc["user_id"],
        course_id=enrollment_doc["course_id"],
        enrolled_at=enrollment_doc["enrolled_at"]
    )

@router.get("/me", response_model=List[EnrollmentOut])
async def my_enrollments(current_user: dict = Depends(get_current_user)):
    """Get all enrollments for current user - from MongoDB"""
    enrollments_collection = get_enrollments_collection()
    
    # Find all enrollments for this user
    cursor = enrollments_collection.find({"user_id": str(current_user["_id"])})
    enrollments = await cursor.to_list(length=1000)
    
    # Convert to response model
    result = []
    for enrollment in enrollments:
        result.append(EnrollmentOut(
            id=str(enrollment["_id"]),
            user_id=enrollment["user_id"],
            course_id=enrollment["course_id"],
            enrolled_at=enrollment.get("enrolled_at", datetime.utcnow())
        ))
    
    return result

@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
async def unenroll(course_id: str, current_user: dict = Depends(get_current_user)):
    """Unenroll current user from a course - removes from MongoDB"""
    enrollments_collection = get_enrollments_collection()
    
    # Find and delete enrollment
    result = await enrollments_collection.delete_one({
        "course_id": course_id,
        "user_id": str(current_user["_id"])
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    return {"message": "Successfully unenrolled from course", "course_id": course_id}

@router.get("/{course_id}/check", response_model=dict)
async def check_enrollment(course_id: str, current_user: dict = Depends(get_current_user)):
    """Check if user is enrolled in a course"""
    enrollments_collection = get_enrollments_collection()
    
    enrollment = await enrollments_collection.find_one({
        "course_id": course_id,
        "user_id": str(current_user["_id"])
    })
    
    return {
        "is_enrolled": enrollment is not None,
        "enrollment_id": str(enrollment["_id"]) if enrollment else None
    }
