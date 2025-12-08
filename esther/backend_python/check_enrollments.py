"""
Script to check enrollments in MongoDB database
Run this to verify if enrollments are being saved

Usage:
    python check_enrollments.py
"""
import sys
import os
import asyncio

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from backend_python.mongodb_db import get_enrollments_collection, get_users_collection, get_courses_collection

async def check_enrollments():
    """Check all enrollments in MongoDB"""
    enrollments_collection = get_enrollments_collection()
    users_collection = get_users_collection()
    courses_collection = get_courses_collection()
    
    try:
        # Get all enrollments
        enrollments = await enrollments_collection.find({}).to_list(length=1000)
        
        print(f"\n{'='*60}")
        print(f"Total Enrollments in MongoDB: {len(enrollments)}")
        print(f"{'='*60}\n")
        
        if len(enrollments) == 0:
            print("⚠️  No enrollments found in the database!")
            print("\nThis could mean:")
            print("1. No one has enrolled in courses yet")
            print("2. Enrollments are only being saved to localStorage (frontend)")
            print("3. The enrollment API is not being called from the frontend")
            return
        
        # Display enrollments with user and course info
        for i, enrollment in enumerate(enrollments, 1):
            user = await users_collection.find_one({"_id": enrollment.get("user_id")})
            course = await courses_collection.find_one({"_id": enrollment.get("course_id")})
            
            print(f"Enrollment #{i}:")
            print(f"  ID: {enrollment.get('_id')}")
            print(f"  User: {user.get('name', 'Unknown') if user else 'Unknown'} ({user.get('email', 'N/A') if user else 'N/A'})")
            print(f"  Course: {course.get('title', 'Unknown') if course else 'Unknown'} (ID: {enrollment.get('course_id')})")
            print(f"  Enrolled At: {enrollment.get('enrolled_at', 'N/A')}")
            print(f"  Progress: {enrollment.get('progress', 0)}%")
            print()
        
        # Summary by user
        print(f"\n{'='*60}")
        print("Summary by User:")
        print(f"{'='*60}\n")
        
        users_with_enrollments = {}
        for enrollment in enrollments:
            user = await users_collection.find_one({"_id": enrollment.get("user_id")})
            course = await courses_collection.find_one({"_id": enrollment.get("course_id")})
            
            user_key = user.get("email") if user else enrollment.get("user_id")
            if user_key not in users_with_enrollments:
                users_with_enrollments[user_key] = []
            users_with_enrollments[user_key].append(course.get("title") if course else enrollment.get("course_id"))
        
        for user_email, courses_list in users_with_enrollments.items():
            print(f"User: {user_email}")
            print(f"  Enrolled in {len(courses_list)} course(s):")
            for course_title in courses_list:
                print(f"    - {course_title}")
            print()
        
        # Summary by course
        print(f"\n{'='*60}")
        print("Summary by Course:")
        print(f"{'='*60}\n")
        
        courses_with_enrollments = {}
        for enrollment in enrollments:
            course = await courses_collection.find_one({"_id": enrollment.get("course_id")})
            course_key = course.get("title") if course else enrollment.get("course_id")
            
            if course_key not in courses_with_enrollments:
                courses_with_enrollments[course_key] = 0
            courses_with_enrollments[course_key] += 1
        
        for course_title, count in courses_with_enrollments.items():
            print(f"{course_title}: {count} enrollment(s)")
        
    except Exception as e:
        print(f"❌ Error checking enrollments: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(check_enrollments())
