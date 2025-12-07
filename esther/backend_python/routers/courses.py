# backend_python/routers/courses.py
from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
from pydantic import BaseModel

from backend_python.mongodb_db import get_courses_collection, get_users_collection
from backend_python.mongodb_models import CourseDocument
from backend_python.schemas import CourseResponse
from backend_python.auth_utils import get_current_user

router = APIRouter()

# Request/Response models for MongoDB
class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "general"
    difficulty: Optional[str] = "beginner"
    accessibility_features: Optional[dict] = {}
    duration: Optional[int] = 0
    modules: Optional[List[dict]] = []

class ModuleCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content: Optional[List[dict]] = []
    order: int
    estimated_time: Optional[int] = 0

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_course(payload: CourseCreate, current_user: dict = Depends(get_current_user)):
    """Create a new course - saves to MongoDB. Only mentors and admins can create courses."""
    user_role = current_user.get("role", "learner")
    if user_role not in ["mentor", "administrator"]:
        raise HTTPException(status_code=403, detail="Only mentors and administrators can create courses")
    
    courses_collection = get_courses_collection()
    
    # Create course document
    course_doc = {
        "_id": str(uuid4()),
        "title": payload.title,
        "description": payload.description or "",
        "category": payload.category or "general",
        "difficulty": payload.difficulty or "beginner",
        "instructor_id": str(current_user["_id"]),
        "accessibility_features": payload.accessibility_features or {},
        "duration": payload.duration or 0,
        "modules": payload.modules or [],
        "is_published": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert into MongoDB
    await courses_collection.insert_one(course_doc)
    
    # Return course response
    return {
        "id": course_doc["_id"],
        "title": course_doc["title"],
        "description": course_doc["description"],
        "category": course_doc["category"],
        "difficulty": course_doc["difficulty"],
        "instructor_id": course_doc["instructor_id"],
        "accessibility_features": course_doc["accessibility_features"],
        "duration": course_doc["duration"],
        "modules": course_doc["modules"],
        "is_published": course_doc["is_published"],
        "created_at": course_doc["created_at"].isoformat(),
        "updated_at": course_doc["updated_at"].isoformat()
    }

@router.get("/instructor/my-courses")
async def get_my_courses(current_user: dict = Depends(get_current_user)):
    """Get all courses created by the current mentor"""
    user_role = current_user.get("role", "learner")
    if user_role not in ["mentor", "administrator"]:
        raise HTTPException(status_code=403, detail="Only mentors can access their courses")
    
    courses_collection = get_courses_collection()
    instructor_id = str(current_user["_id"])
    
    # Find all courses by this instructor
    cursor = courses_collection.find({"instructor_id": instructor_id})
    courses = await cursor.to_list(length=1000)
    
    # Convert to response format
    result = []
    for course in courses:
        result.append({
            "id": str(course["_id"]),
            "title": course.get("title", ""),
            "description": course.get("description", ""),
            "category": course.get("category", "general"),
            "difficulty": course.get("difficulty", "beginner"),
            "instructor_id": course.get("instructor_id", ""),
            "accessibility_features": course.get("accessibility_features", {}),
            "duration": course.get("duration", 0),
            "modules": course.get("modules", []),
            "is_published": course.get("is_published", False),
            "created_at": course.get("created_at", datetime.utcnow()).isoformat() if isinstance(course.get("created_at"), datetime) else course.get("created_at"),
            "updated_at": course.get("updated_at", datetime.utcnow()).isoformat() if isinstance(course.get("updated_at"), datetime) else course.get("updated_at")
        })
    
    return result

@router.get("/")
async def list_courses(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    instructor_id: Optional[str] = Query(None)
):
    """List all courses from MongoDB"""
    courses_collection = get_courses_collection()
    
    # Build query
    query = {}
    if category:
        query["category"] = category
    if difficulty:
        query["difficulty"] = difficulty
    if instructor_id:
        query["instructor_id"] = instructor_id
    
    # Fetch courses
    cursor = courses_collection.find(query)
    courses = await cursor.to_list(length=1000)
    
    # Convert to response format
    result = []
    for course in courses:
        result.append({
            "id": str(course["_id"]),
            "title": course.get("title", ""),
            "description": course.get("description", ""),
            "category": course.get("category", "general"),
            "difficulty": course.get("difficulty", "beginner"),
            "instructor_id": course.get("instructor_id", ""),
            "accessibility_features": course.get("accessibility_features", {}),
            "duration": course.get("duration", 0),
            "modules": course.get("modules", []),
            "is_published": course.get("is_published", False),
            "created_at": course.get("created_at", datetime.utcnow()).isoformat() if isinstance(course.get("created_at"), datetime) else course.get("created_at"),
            "updated_at": course.get("updated_at", datetime.utcnow()).isoformat() if isinstance(course.get("updated_at"), datetime) else course.get("updated_at")
        })
    
    return result

@router.get("/{course_id}")
async def get_course(course_id: str = Path(...)):
    """Get a single course by ID from MongoDB"""
    courses_collection = get_courses_collection()
    
    course = await courses_collection.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return {
        "id": str(course["_id"]),
        "title": course.get("title", ""),
        "description": course.get("description", ""),
        "category": course.get("category", "general"),
        "difficulty": course.get("difficulty", "beginner"),
        "instructor_id": course.get("instructor_id", ""),
        "accessibility_features": course.get("accessibility_features", {}),
        "duration": course.get("duration", 0),
        "modules": course.get("modules", []),
        "is_published": course.get("is_published", False),
        "created_at": course.get("created_at", datetime.utcnow()).isoformat() if isinstance(course.get("created_at"), datetime) else course.get("created_at"),
        "updated_at": course.get("updated_at", datetime.utcnow()).isoformat() if isinstance(course.get("updated_at"), datetime) else course.get("updated_at")
    }

@router.put("/{course_id}")
async def update_course(
    course_id: str = Path(...),
    payload: CourseCreate = None,
    current_user: dict = Depends(get_current_user)
):
    """Update a course - only instructor or admin can update"""
    courses_collection = get_courses_collection()
    
    # Check if course exists
    course = await courses_collection.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check permissions
    user_role = current_user.get("role", "learner")
    is_instructor = course.get("instructor_id") == str(current_user["_id"])
    
    if not (is_instructor or user_role == "administrator"):
        raise HTTPException(status_code=403, detail="Only the course instructor or administrator can update this course")
    
    # Build update data
    update_data = {
        "updated_at": datetime.utcnow()
    }
    
    if payload:
        if payload.title:
            update_data["title"] = payload.title
        if payload.description is not None:
            update_data["description"] = payload.description
        if payload.category:
            update_data["category"] = payload.category
        if payload.difficulty:
            update_data["difficulty"] = payload.difficulty
        if payload.accessibility_features is not None:
            update_data["accessibility_features"] = payload.accessibility_features
        if payload.duration is not None:
            update_data["duration"] = payload.duration
        if payload.modules is not None:
            update_data["modules"] = payload.modules
    
    # Update in MongoDB
    await courses_collection.update_one(
        {"_id": course_id},
        {"$set": update_data}
    )
    
    # Return updated course
    updated_course = await courses_collection.find_one({"_id": course_id})
    return {
        "id": str(updated_course["_id"]),
        "title": updated_course.get("title", ""),
        "description": updated_course.get("description", ""),
        "category": updated_course.get("category", "general"),
        "difficulty": updated_course.get("difficulty", "beginner"),
        "instructor_id": updated_course.get("instructor_id", ""),
        "accessibility_features": updated_course.get("accessibility_features", {}),
        "duration": updated_course.get("duration", 0),
        "modules": updated_course.get("modules", []),
        "is_published": updated_course.get("is_published", False),
        "created_at": updated_course.get("created_at", datetime.utcnow()).isoformat() if isinstance(updated_course.get("created_at"), datetime) else updated_course.get("created_at"),
        "updated_at": updated_course.get("updated_at", datetime.utcnow()).isoformat() if isinstance(updated_course.get("updated_at"), datetime) else updated_course.get("updated_at")
    }

@router.post("/{course_id}/modules", status_code=status.HTTP_201_CREATED)
async def add_module(
    course_id: str = Path(...),
    payload: ModuleCreate = None,
    current_user: dict = Depends(get_current_user)
):
    """Add a module to a course - only mentor/instructor or admin can add modules"""
    courses_collection = get_courses_collection()
    
    # Check if course exists
    course = await courses_collection.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check permissions
    user_role = current_user.get("role", "learner")
    is_instructor = course.get("instructor_id") == str(current_user["_id"])
    
    if not (is_instructor or user_role == "administrator"):
        raise HTTPException(status_code=403, detail="Only the course instructor or administrator can add modules")
    
    # Create module
    module = {
        "id": str(uuid4()),
        "title": payload.title,
        "description": payload.description or "",
        "content": payload.content or [],
        "order": payload.order,
        "estimated_time": payload.estimated_time or 0
    }
    
    # Get existing modules
    modules = course.get("modules", [])
    modules.append(module)
    
    # Sort modules by order
    modules.sort(key=lambda x: x.get("order", 0))
    
    # Update course
    await courses_collection.update_one(
        {"_id": course_id},
        {
            "$set": {
                "modules": modules,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Module added successfully", "module": module}

@router.put("/{course_id}/modules/{module_id}")
async def update_module(
    course_id: str = Path(...),
    module_id: str = Path(...),
    payload: ModuleCreate = None,
    current_user: dict = Depends(get_current_user)
):
    """Update a module in a course"""
    courses_collection = get_courses_collection()
    
    # Check if course exists
    course = await courses_collection.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check permissions
    user_role = current_user.get("role", "learner")
    is_instructor = course.get("instructor_id") == str(current_user["_id"])
    
    if not (is_instructor or user_role == "administrator"):
        raise HTTPException(status_code=403, detail="Only the course instructor or administrator can update modules")
    
    # Get modules
    modules = course.get("modules", [])
    module_index = next((i for i, m in enumerate(modules) if m.get("id") == module_id), None)
    
    if module_index is None:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Update module
    if payload:
        if payload.title:
            modules[module_index]["title"] = payload.title
        if payload.description is not None:
            modules[module_index]["description"] = payload.description
        if payload.content is not None:
            modules[module_index]["content"] = payload.content
        if payload.order is not None:
            modules[module_index]["order"] = payload.order
        if payload.estimated_time is not None:
            modules[module_index]["estimated_time"] = payload.estimated_time
    
    # Sort modules by order
    modules.sort(key=lambda x: x.get("order", 0))
    
    # Update course
    await courses_collection.update_one(
        {"_id": course_id},
        {
            "$set": {
                "modules": modules,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Module updated successfully", "module": modules[module_index]}

@router.delete("/{course_id}/modules/{module_id}")
async def delete_module(
    course_id: str = Path(...),
    module_id: str = Path(...),
    current_user: dict = Depends(get_current_user)
):
    """Delete a module from a course"""
    courses_collection = get_courses_collection()
    
    # Check if course exists
    course = await courses_collection.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check permissions
    user_role = current_user.get("role", "learner")
    is_instructor = course.get("instructor_id") == str(current_user["_id"])
    
    if not (is_instructor or user_role == "administrator"):
        raise HTTPException(status_code=403, detail="Only the course instructor or administrator can delete modules")
    
    # Get modules and remove the one with matching ID
    modules = course.get("modules", [])
    modules = [m for m in modules if m.get("id") != module_id]
    
    # Update course
    await courses_collection.update_one(
        {"_id": course_id},
        {
            "$set": {
                "modules": modules,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Module deleted successfully"}

@router.patch("/{course_id}/publish")
async def toggle_publish(
    course_id: str = Path(...),
    current_user: dict = Depends(get_current_user)
):
    """Toggle course publish status"""
    courses_collection = get_courses_collection()
    
    # Check if course exists
    course = await courses_collection.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check permissions
    user_role = current_user.get("role", "learner")
    is_instructor = course.get("instructor_id") == str(current_user["_id"])
    
    if not (is_instructor or user_role == "administrator"):
        raise HTTPException(status_code=403, detail="Only the course instructor or administrator can publish/unpublish courses")
    
    # Toggle publish status
    new_status = not course.get("is_published", False)
    
    await courses_collection.update_one(
        {"_id": course_id},
        {
            "$set": {
                "is_published": new_status,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": f"Course {'published' if new_status else 'unpublished'} successfully", "is_published": new_status}
