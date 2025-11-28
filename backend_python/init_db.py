#!/usr/bin/env python3
# init_db.py
"""
Database initialization script
Creates initial data for development/testing
"""
import sys
import os
from sqlalchemy.orm import sessionmaker
import uuid

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend_python.database import engine, Base
from backend_python.models import User, Course, UserRole, CourseCategory, CourseDifficulty
from backend_python.auth_utils import get_password_hash

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Create admin user
        admin_email = "admin@inclusivelearning.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        
        if not existing_admin:
            admin_user = User(
                id=uuid.uuid4(),
                email=admin_email,
                name="System Administrator",
                password_hash=get_password_hash("admin123"),
                role=UserRole.administrator.value
            )
            db.add(admin_user)
            db.commit()
            print(f"✅ Admin user created: {admin_email} (password: admin123)")
        else:
            admin_user = existing_admin
            print(f"ℹ️  Admin user already exists: {admin_email}")
        
        # Create test learner
        learner_email = "learner@test.com"
        existing_learner = db.query(User).filter(User.email == learner_email).first()
        
        if not existing_learner:
            learner_user = User(
                id=uuid.uuid4(),
                email=learner_email,
                name="Test Learner",
                password_hash=get_password_hash("password123"),
                role=UserRole.learner.value
            )
            db.add(learner_user)
            db.commit()
            print(f"✅ Test learner created: {learner_email} (password: password123)")
        
        # Create sample courses
        sample_courses = [
            {
                "title": "Introduction to Web Accessibility",
                "description": "Learn the fundamentals of web accessibility and inclusive design principles.",
                "category": CourseCategory.accessibility.value,
                "difficulty": CourseDifficulty.beginner.value,
            },
            {
                "title": "Digital Skills for Everyone",
                "description": "Basic digital literacy skills for all learners, including assistive technology.",
                "category": CourseCategory.general.value,
                "difficulty": CourseDifficulty.beginner.value,
            }
        ]
        
        for course_data in sample_courses:
            existing_course = db.query(Course).filter(Course.title == course_data["title"]).first()
            if not existing_course:
                course = Course(
                    id=uuid.uuid4(),
                    title=course_data["title"],
                    description=course_data["description"],
                    category=course_data["category"],
                    difficulty=course_data["difficulty"],
                    instructor_id=admin_user.id,
                    is_published=True,
                    accessibility_features={
                        "captions": True,
                        "transcripts": True,
                        "screen_reader_compatible": True
                    }
                )
                db.add(course)
                db.commit()
                print(f"✅ Sample course created: {course_data['title']}")
            else:
                print(f"ℹ️  Course already exists: {course_data['title']}")
        
        print("🎉 Database initialization completed!")
        print("\n📋 Test Accounts:")
        print(f"   Admin: {admin_email} / admin123")
        print(f"   Learner: {learner_email} / password123")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_db()