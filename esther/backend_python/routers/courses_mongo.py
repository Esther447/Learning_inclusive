from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime

from backend_python.mongodb_db import get_courses_collection

router = APIRouter()

@router.get("/", response_model=None)
@router.get("", response_model=None)
async def list_courses(category: Optional[str] = None, difficulty: Optional[str] = None):
    """Get all published courses from MongoDB"""
    try:
        courses_col = get_courses_collection()
        query = {"is_published": True}
        
        if category:
            query["category"] = category
        if difficulty:
            query["difficulty"] = difficulty
        
        courses = await courses_col.find(query).to_list(100)
        
        # Convert MongoDB documents to response format
        result = []
        for course in courses:
            # Convert accessibilityFeatures to array if it's a dict
            acc_features = course.get("accessibility_features", [])
            if isinstance(acc_features, dict):
                acc_features = list(acc_features.keys()) if acc_features else []
            
            result.append({
                "id": course.get("id", str(course.get("_id"))),
                "title": course.get("title"),
                "description": course.get("description"),
                "category": course.get("category", "general"),
                "difficulty": course.get("difficulty", "beginner"),
                "instructorId": course.get("instructor_id"),
                "learningOutcomes": course.get("learning_outcomes", []),
                "prerequisites": course.get("prerequisites", []),
                "durationHours": course.get("duration_hours"),
                "duration": course.get("duration_hours"),
                "coverImage": course.get("cover_image"),
                "tags": course.get("tags", []),
                "accessibilityFeatures": acc_features,
                "captions": course.get("captions", []),
                "transcriptUrl": course.get("transcript_url"),
                "signLanguageVideoUrl": course.get("sign_language_video_url"),
                "isPublished": course.get("is_published", True),
                "modules": course.get("modules", []),
                "createdAt": course.get("created_at").isoformat() if course.get("created_at") else None
            })
        
        return result
    except Exception as e:
        print(f"Error fetching courses: {e}")
        return []

@router.get("/{course_id}")
async def get_course(course_id: str):
    """Get single course by ID"""
    try:
        courses_col = get_courses_collection()
        course = await courses_col.find_one({"id": course_id})
        
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Convert accessibilityFeatures to array if it's a dict
        acc_features = course.get("accessibility_features", [])
        if isinstance(acc_features, dict):
            acc_features = list(acc_features.keys()) if acc_features else []
        
        return {
            "id": course.get("id", str(course.get("_id"))),
            "title": course.get("title"),
            "description": course.get("description"),
            "category": course.get("category", "general"),
            "difficulty": course.get("difficulty", "beginner"),
            "instructorId": course.get("instructor_id"),
            "learningOutcomes": course.get("learning_outcomes", []),
            "prerequisites": course.get("prerequisites", []),
            "durationHours": course.get("duration_hours"),
            "duration": course.get("duration_hours"),
            "coverImage": course.get("cover_image"),
            "tags": course.get("tags", []),
            "accessibilityFeatures": acc_features,
            "captions": course.get("captions", []),
            "transcriptUrl": course.get("transcript_url"),
            "signLanguageVideoUrl": course.get("sign_language_video_url"),
            "isPublished": course.get("is_published", True),
            "modules": course.get("modules", []),
            "createdAt": course.get("created_at").isoformat() if course.get("created_at") else None
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching course: {e}")
        raise HTTPException(status_code=500, detail=str(e))
