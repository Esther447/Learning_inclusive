"""
Add more courses to MongoDB
Run: python seed_more_courses.py
"""
import asyncio
import sys
import os
from datetime import datetime, timedelta

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from backend_python.mongodb_db import get_courses_collection

# Additional Courses
ADDITIONAL_COURSES = [
    {
        "id": "course-data-science-004",
        "title": "Data Science with Python",
        "description": "Learn data analysis, visualization, and machine learning with Python",
        "category": "technology",
        "difficulty": "intermediate",
        "duration_hours": 45,
        "instructor_id": "instructor-004",
        "instructor_name": "Dr. Alice Mukamana",
        "is_published": True,
        "cover_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        "accessibility_features": ["screen-reader", "captions", "text-to-speech"],
        "tags": ["python", "data-science", "machine-learning", "analytics"],
        "created_at": datetime.utcnow(),
        "modules": [],
        "assignments": [],
        "quizzes": [],
        "badges": [
            {"id": "badge-ds-001", "name": "Data Analyst", "description": "Mastered data analysis", "icon": "📊", "criteria": "Complete first 3 modules"},
            {"id": "badge-ds-002", "name": "ML Expert", "description": "Completed machine learning module", "icon": "🤖", "criteria": "Complete ML module with 85%+"}
        ]
    },
    {
        "id": "course-graphic-design-005",
        "title": "Graphic Design Fundamentals",
        "description": "Master design principles, color theory, and create stunning visuals",
        "category": "vocational",
        "difficulty": "beginner",
        "duration_hours": 35,
        "instructor_id": "instructor-005",
        "instructor_name": "Jean-Paul Habimana",
        "is_published": True,
        "cover_image": "https://images.unsplash.com/photo-1561070791-2526d30994b5",
        "accessibility_features": ["screen-reader", "captions", "high-contrast", "text-to-speech"],
        "tags": ["design", "graphics", "creative", "visual-arts"],
        "created_at": datetime.utcnow(),
        "modules": [],
        "assignments": [],
        "quizzes": [],
        "badges": [
            {"id": "badge-gd-001", "name": "Design Thinker", "description": "Mastered design principles", "icon": "🎨", "criteria": "Complete design principles module"},
            {"id": "badge-gd-002", "name": "Color Master", "description": "Expert in color theory", "icon": "🌈", "criteria": "Complete color theory with 90%+"}
        ]
    },
    {
        "id": "course-business-006",
        "title": "Entrepreneurship & Business Skills",
        "description": "Start and grow your own business with essential entrepreneurship skills",
        "category": "soft_skills",
        "difficulty": "beginner",
        "duration_hours": 30,
        "instructor_id": "instructor-006",
        "instructor_name": "Marie Uwera",
        "is_published": True,
        "cover_image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        "accessibility_features": ["simplified-ui", "captions", "text-to-speech"],
        "tags": ["business", "entrepreneurship", "startup", "management"],
        "created_at": datetime.utcnow(),
        "modules": [],
        "assignments": [],
        "quizzes": [],
        "badges": [
            {"id": "badge-bus-001", "name": "Business Planner", "description": "Created business plan", "icon": "📋", "criteria": "Complete business planning module"},
            {"id": "badge-bus-002", "name": "Entrepreneur", "description": "Completed full course", "icon": "💼", "criteria": "Complete all modules"}
        ]
    },
    {
        "id": "course-mobile-007",
        "title": "Mobile App Development",
        "description": "Build mobile apps for Android and iOS using React Native",
        "category": "technology",
        "difficulty": "intermediate",
        "duration_hours": 55,
        "instructor_id": "instructor-007",
        "instructor_name": "Patrick Nkusi",
        "is_published": True,
        "cover_image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
        "accessibility_features": ["screen-reader", "captions", "keyboard-navigation"],
        "tags": ["mobile", "react-native", "android", "ios", "app-development"],
        "created_at": datetime.utcnow(),
        "modules": [],
        "assignments": [],
        "quizzes": [],
        "badges": [
            {"id": "badge-mob-001", "name": "Mobile Developer", "description": "Built first mobile app", "icon": "📱", "criteria": "Complete first app project"},
            {"id": "badge-mob-002", "name": "App Publisher", "description": "Published app to store", "icon": "🚀", "criteria": "Complete final project"}
        ]
    },
    {
        "id": "course-cybersecurity-008",
        "title": "Cybersecurity Basics",
        "description": "Learn to protect systems, networks, and data from cyber threats",
        "category": "technology",
        "difficulty": "beginner",
        "duration_hours": 40,
        "instructor_id": "instructor-008",
        "instructor_name": "Emmanuel Kayitare",
        "is_published": True,
        "cover_image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        "accessibility_features": ["screen-reader", "captions", "text-to-speech"],
        "tags": ["security", "cybersecurity", "networking", "ethical-hacking"],
        "created_at": datetime.utcnow(),
        "modules": [],
        "assignments": [],
        "quizzes": [],
        "badges": [
            {"id": "badge-sec-001", "name": "Security Aware", "description": "Completed security fundamentals", "icon": "🔒", "criteria": "Complete first 2 modules"},
            {"id": "badge-sec-002", "name": "Cyber Defender", "description": "Mastered cybersecurity", "icon": "🛡️", "criteria": "Complete all modules with 85%+"}
        ]
    },
    {
        "id": "course-english-009",
        "title": "English for Beginners",
        "description": "Learn English language basics - reading, writing, speaking, and listening",
        "category": "literacy",
        "difficulty": "beginner",
        "duration_hours": 40,
        "instructor_id": "instructor-009",
        "instructor_name": "Linda Mutesi",
        "is_published": True,
        "cover_image": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
        "accessibility_features": ["simplified-ui", "captions", "text-to-speech", "sign-language"],
        "tags": ["english", "language", "literacy", "communication"],
        "created_at": datetime.utcnow(),
        "modules": [],
        "assignments": [],
        "quizzes": [],
        "badges": [
            {"id": "badge-eng-001", "name": "English Learner", "description": "Started English journey", "icon": "📚", "criteria": "Complete first module"},
            {"id": "badge-eng-002", "name": "Conversationalist", "description": "Can hold basic conversations", "icon": "💬", "criteria": "Complete speaking modules"}
        ]
    },
    {
        "id": "course-agriculture-010",
        "title": "Modern Agriculture Techniques",
        "description": "Learn sustainable farming, crop management, and agricultural technology",
        "category": "vocational",
        "difficulty": "beginner",
        "duration_hours": 35,
        "instructor_id": "instructor-010",
        "instructor_name": "Joseph Niyonzima",
        "is_published": True,
        "cover_image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
        "accessibility_features": ["simplified-ui", "captions", "text-to-speech"],
        "tags": ["agriculture", "farming", "sustainability", "crops"],
        "created_at": datetime.utcnow(),
        "modules": [],
        "assignments": [],
        "quizzes": [],
        "badges": [
            {"id": "badge-agr-001", "name": "Green Thumb", "description": "Learned crop basics", "icon": "🌱", "criteria": "Complete crop management module"},
            {"id": "badge-agr-002", "name": "Modern Farmer", "description": "Mastered modern techniques", "icon": "🚜", "criteria": "Complete all modules"}
        ]
    }
]

async def seed_additional_courses():
    """Add more courses to MongoDB"""
    try:
        courses_col = get_courses_collection()
        
        # Insert new courses
        for course in ADDITIONAL_COURSES:
            # Check if course already exists
            existing = await courses_col.find_one({"id": course["id"]})
            if existing:
                print(f"[SKIP] Course already exists: {course['title']}")
                continue
                
            await courses_col.insert_one(course)
            print(f"[OK] Inserted: {course['title']}")
        
        print(f"\n[SUCCESS] Added {len(ADDITIONAL_COURSES)} new courses!")
        
    except Exception as e:
        print(f"[ERROR] Error seeding courses: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(seed_additional_courses())
