"""
Seed Script - Populate Platform with Real Educational Content
Run this to fill your platform with courses, modules, lessons, quizzes, and resources
"""

import asyncio
from datetime import datetime, timedelta
from uuid import uuid4
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_python.mongodb_db import (
    get_users_collection,
    get_courses_collection,
    get_mongo_db
)
from backend_python.auth_utils import get_password_hash

async def seed_all_content():
    """Seed complete educational content"""
    
    db = get_mongo_db()
    users_col = get_users_collection()
    courses_col = get_courses_collection()
    
    # Create instructor
    instructor_id = str(uuid4())
    instructor = {
        "id": instructor_id,
        "_id": instructor_id,
        "email": "instructor@inclusive.edu",
        "password_hash": get_password_hash("instructor123"),
        "name": "Dr. Sarah Johnson",
        "role": "mentor",
        "created_at": datetime.utcnow()
    }
    
    existing_instructor = await users_col.find_one({"email": instructor["email"]})
    if not existing_instructor:
        await users_col.insert_one(instructor)
        print(f"✅ Created instructor: {instructor['email']}")
    else:
        instructor_id = existing_instructor["id"]
        print(f"ℹ️  Instructor already exists")
    
    # COURSES DATA
    courses_data = [
        {
            "title": "Web Development Fundamentals",
            "category": "technology",
            "difficulty": "beginner",
            "description": "Learn HTML, CSS, and JavaScript from scratch. Build responsive websites with modern web technologies.",
            "duration_hours": 40,
            "learning_outcomes": [
                "Build responsive websites using HTML5 and CSS3",
                "Write interactive JavaScript code",
                "Understand web accessibility standards",
                "Deploy websites to the internet"
            ],
            "modules": [
                {
                    "title": "Introduction to HTML",
                    "description": "Learn the building blocks of web pages",
                    "lessons": [
                        {
                            "title": "What is HTML?",
                            "type": "video",
                            "content": "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically.\n\nKey Concepts:\n- Elements and Tags\n- Attributes\n- Document Structure\n- Semantic HTML",
                            "video_url": "https://www.youtube.com/watch?v=UB1O30fR-EE",
                            "resources": ["https://developer.mozilla.org/en-US/docs/Web/HTML"]
                        },
                        {
                            "title": "HTML Document Structure",
                            "type": "text",
                            "content": "Every HTML document follows a basic structure:\n\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>My First Heading</h1>\n  <p>My first paragraph.</p>\n</body>\n</html>\n\nPractice creating your first HTML page!",
                            "resources": ["https://www.w3schools.com/html/"]
                        },
                        {
                            "title": "HTML Forms and Input",
                            "type": "interactive",
                            "content": "Forms allow users to input data. Learn about:\n- Text inputs\n- Checkboxes and radio buttons\n- Select dropdowns\n- Form validation\n- Accessible form design",
                            "resources": ["https://web.dev/learn/forms/"]
                        }
                    ]
                },
                {
                    "title": "CSS Styling",
                    "description": "Make your websites beautiful with CSS",
                    "lessons": [
                        {
                            "title": "CSS Basics",
                            "type": "video",
                            "content": "CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.\n\nTopics:\n- Selectors\n- Properties and Values\n- Box Model\n- Colors and Typography",
                            "video_url": "https://www.youtube.com/watch?v=1PnVor36_40"
                        },
                        {
                            "title": "Responsive Design",
                            "type": "text",
                            "content": "Create websites that work on all devices:\n- Media Queries\n- Flexible Grids\n- Flexible Images\n- Mobile-First Design\n\nExample:\n@media (max-width: 768px) {\n  .container { width: 100%; }\n}"
                        }
                    ]
                },
                {
                    "title": "JavaScript Basics",
                    "description": "Add interactivity to your websites",
                    "lessons": [
                        {
                            "title": "JavaScript Introduction",
                            "type": "video",
                            "content": "JavaScript makes websites interactive. Learn:\n- Variables and Data Types\n- Functions\n- Events\n- DOM Manipulation",
                            "video_url": "https://www.youtube.com/watch?v=W6NZfCO5SIk"
                        }
                    ]
                }
            ],
            "quizzes": [
                {
                    "title": "HTML Basics Quiz",
                    "questions": [
                        {
                            "question": "What does HTML stand for?",
                            "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language"],
                            "correct": 0
                        },
                        {
                            "question": "Which tag is used for the largest heading?",
                            "options": ["<h6>", "<h1>", "<heading>"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "assignments": [
                {
                    "title": "Build Your First Website",
                    "description": "Create a personal portfolio website using HTML and CSS. Include:\n- About section\n- Skills section\n- Contact form\n- Responsive design",
                    "points": 100,
                    "due_days": 7
                }
            ],
            "announcements": [
                {
                    "title": "Welcome to Web Development!",
                    "content": "Welcome to the course! We'll be learning HTML, CSS, and JavaScript. Make sure to practice daily and ask questions in the discussion forum."
                }
            ]
        },
        {
            "title": "Digital Literacy Essentials",
            "category": "literacy",
            "difficulty": "beginner",
            "description": "Master essential computer skills, internet safety, and digital communication tools.",
            "duration_hours": 20,
            "learning_outcomes": [
                "Navigate computers and operating systems confidently",
                "Use email and online communication tools",
                "Practice internet safety and privacy",
                "Create and manage digital documents"
            ],
            "modules": [
                {
                    "title": "Computer Basics",
                    "description": "Understanding your computer",
                    "lessons": [
                        {
                            "title": "Parts of a Computer",
                            "type": "text",
                            "content": "Learn about:\n- Hardware: Monitor, Keyboard, Mouse, CPU\n- Software: Operating Systems, Applications\n- Storage: Hard Drive, Cloud Storage\n- Peripherals: Printer, Scanner, Webcam"
                        },
                        {
                            "title": "Using Windows/Mac",
                            "type": "video",
                            "content": "Navigate your operating system:\n- Desktop and Taskbar\n- File Explorer/Finder\n- Installing Programs\n- System Settings",
                            "video_url": "https://www.youtube.com/watch?v=0aRtupiY9Dw"
                        }
                    ]
                },
                {
                    "title": "Internet and Email",
                    "description": "Communicate online effectively",
                    "lessons": [
                        {
                            "title": "Using Email",
                            "type": "interactive",
                            "content": "Email essentials:\n- Creating an account\n- Composing messages\n- Attachments\n- Email etiquette\n- Organizing inbox"
                        },
                        {
                            "title": "Internet Safety",
                            "type": "text",
                            "content": "Stay safe online:\n- Strong passwords\n- Recognizing phishing\n- Privacy settings\n- Safe browsing\n- Protecting personal information"
                        }
                    ]
                }
            ],
            "quizzes": [
                {
                    "title": "Digital Literacy Quiz",
                    "questions": [
                        {
                            "question": "What is phishing?",
                            "options": ["A type of fishing", "A scam to steal personal information", "A computer game"],
                            "correct": 1
                        }
                    ]
                }
            ],
            "assignments": [
                {
                    "title": "Create a Professional Email",
                    "description": "Set up a professional email account and write a formal email to your instructor introducing yourself.",
                    "points": 50,
                    "due_days": 3
                }
            ]
        },
        {
            "title": "Communication Skills for Success",
            "category": "soft_skills",
            "difficulty": "beginner",
            "description": "Develop effective communication, presentation, and interpersonal skills for professional success.",
            "duration_hours": 25,
            "learning_outcomes": [
                "Communicate clearly and confidently",
                "Give effective presentations",
                "Practice active listening",
                "Write professional emails and documents"
            ],
            "modules": [
                {
                    "title": "Verbal Communication",
                    "description": "Speak with confidence",
                    "lessons": [
                        {
                            "title": "Effective Speaking",
                            "type": "video",
                            "content": "Learn to speak clearly:\n- Voice projection\n- Pace and tone\n- Body language\n- Overcoming nervousness",
                            "video_url": "https://www.youtube.com/watch?v=eIho2S0ZahI"
                        },
                        {
                            "title": "Active Listening",
                            "type": "text",
                            "content": "Listening is as important as speaking:\n- Pay full attention\n- Show you're listening\n- Provide feedback\n- Defer judgment\n- Respond appropriately"
                        }
                    ]
                },
                {
                    "title": "Written Communication",
                    "description": "Write professionally",
                    "lessons": [
                        {
                            "title": "Professional Email Writing",
                            "type": "interactive",
                            "content": "Email best practices:\n- Clear subject lines\n- Professional greeting\n- Concise body\n- Proper closing\n- Proofreading"
                        }
                    ]
                }
            ],
            "quizzes": [
                {
                    "title": "Communication Skills Quiz",
                    "questions": [
                        {
                            "question": "What is active listening?",
                            "options": ["Listening to music", "Fully concentrating on what is being said", "Talking while someone else talks"],
                            "correct": 1
                        }
                    ]
                }
            ]
        },
        {
            "title": "Mobile App Development with React Native",
            "category": "technology",
            "difficulty": "intermediate",
            "description": "Build cross-platform mobile applications using React Native and JavaScript.",
            "duration_hours": 50,
            "learning_outcomes": [
                "Build iOS and Android apps with one codebase",
                "Understand React Native components",
                "Implement navigation and state management",
                "Deploy apps to app stores"
            ],
            "modules": [
                {
                    "title": "React Native Basics",
                    "description": "Get started with React Native",
                    "lessons": [
                        {
                            "title": "Setting Up Development Environment",
                            "type": "text",
                            "content": "Install required tools:\n- Node.js\n- React Native CLI\n- Android Studio / Xcode\n- VS Code\n\nCreate your first app:\nnpx react-native init MyApp"
                        },
                        {
                            "title": "Core Components",
                            "type": "video",
                            "content": "Learn essential components:\n- View, Text, Image\n- ScrollView, FlatList\n- TextInput, Button\n- TouchableOpacity",
                            "video_url": "https://www.youtube.com/watch?v=0-S5a0eXPoc"
                        }
                    ]
                }
            ]
        },
        {
            "title": "Graphic Design Fundamentals",
            "category": "vocational",
            "difficulty": "beginner",
            "description": "Learn design principles, color theory, and tools like Canva and Adobe Creative Suite.",
            "duration_hours": 30,
            "learning_outcomes": [
                "Understand design principles",
                "Use design software effectively",
                "Create professional graphics",
                "Build a design portfolio"
            ],
            "modules": [
                {
                    "title": "Design Principles",
                    "description": "Foundation of good design",
                    "lessons": [
                        {
                            "title": "Color Theory",
                            "type": "video",
                            "content": "Understanding colors:\n- Color wheel\n- Complementary colors\n- Color psychology\n- Creating palettes",
                            "video_url": "https://www.youtube.com/watch?v=_2LLXnUdUIc"
                        },
                        {
                            "title": "Typography Basics",
                            "type": "text",
                            "content": "Choosing and using fonts:\n- Font families\n- Hierarchy\n- Readability\n- Pairing fonts"
                        }
                    ]
                }
            ]
        },
        {
            "title": "Business Communication Skills",
            "category": "soft_skills",
            "difficulty": "intermediate",
            "description": "Master professional communication for business environments, meetings, and presentations.",
            "duration_hours": 20,
            "learning_outcomes": [
                "Lead effective meetings",
                "Write business reports",
                "Negotiate successfully",
                "Handle difficult conversations"
            ],
            "modules": [
                {
                    "title": "Business Writing",
                    "description": "Professional documents",
                    "lessons": [
                        {
                            "title": "Writing Business Reports",
                            "type": "text",
                            "content": "Structure of business reports:\n- Executive summary\n- Introduction\n- Methodology\n- Findings\n- Recommendations\n- Conclusion"
                        }
                    ]
                }
            ]
        }
    ]
    
    # Insert courses with all content
    for course_data in courses_data:
        course_id = str(uuid4())
        
        # Create course
        course = {
            "id": course_id,
            "_id": course_id,
            "title": course_data["title"],
            "description": course_data["description"],
            "category": course_data["category"],
            "difficulty": course_data["difficulty"],
            "instructor_id": instructor_id,
            "duration_hours": course_data["duration_hours"],
            "learning_outcomes": course_data["learning_outcomes"],
            "is_published": True,
            "tags": [course_data["category"], course_data["difficulty"]],
            "accessibility_features": {
                "captions": True,
                "transcripts": True,
                "screen_reader": True,
                "keyboard_navigation": True
            },
            "created_at": datetime.utcnow()
        }
        
        existing_course = await courses_col.find_one({"title": course["title"]})
        if existing_course:
            print(f"ℹ️  Course already exists: {course['title']}")
            course_id = existing_course["id"]
        else:
            await courses_col.insert_one(course)
            print(f"✅ Created course: {course['title']}")
        
        # Create modules
        modules_col = db["modules"]
        for mod_idx, module_data in enumerate(course_data.get("modules", [])):
            module_id = str(uuid4())
            module = {
                "id": module_id,
                "_id": module_id,
                "course_id": course_id,
                "title": module_data["title"],
                "description": module_data["description"],
                "order_index": mod_idx,
                "created_at": datetime.utcnow()
            }
            
            existing_module = await modules_col.find_one({"course_id": course_id, "title": module["title"]})
            if not existing_module:
                await modules_col.insert_one(module)
                print(f"  ✅ Created module: {module['title']}")
            else:
                module_id = existing_module["id"]
            
            # Create lessons
            lessons_col = db["lessons"]
            for lesson_idx, lesson_data in enumerate(module_data.get("lessons", [])):
                lesson_id = str(uuid4())
                lesson = {
                    "id": lesson_id,
                    "_id": lesson_id,
                    "module_id": module_id,
                    "title": lesson_data["title"],
                    "lesson_type": lesson_data["type"],
                    "content": lesson_data["content"],
                    "video_url": lesson_data.get("video_url"),
                    "resource_links": lesson_data.get("resources", []),
                    "order_index": lesson_idx,
                    "created_at": datetime.utcnow()
                }
                
                existing_lesson = await lessons_col.find_one({"module_id": module_id, "title": lesson["title"]})
                if not existing_lesson:
                    await lessons_col.insert_one(lesson)
                    print(f"    ✅ Created lesson: {lesson['title']}")
        
        # Create quizzes
        quizzes_col = db["quizzes"]
        for quiz_data in course_data.get("quizzes", []):
            quiz_id = str(uuid4())
            quiz = {
                "id": quiz_id,
                "_id": quiz_id,
                "course_id": course_id,
                "title": quiz_data["title"],
                "questions": quiz_data["questions"],
                "created_at": datetime.utcnow()
            }
            
            existing_quiz = await quizzes_col.find_one({"course_id": course_id, "title": quiz["title"]})
            if not existing_quiz:
                await quizzes_col.insert_one(quiz)
                print(f"  ✅ Created quiz: {quiz['title']}")
        
        # Create assignments
        assignments_col = db["assignments"]
        for assign_data in course_data.get("assignments", []):
            assignment_id = str(uuid4())
            assignment = {
                "id": assignment_id,
                "_id": assignment_id,
                "course_id": course_id,
                "title": assign_data["title"],
                "description": assign_data["description"],
                "points": assign_data["points"],
                "due_date": datetime.utcnow() + timedelta(days=assign_data["due_days"]),
                "created_at": datetime.utcnow()
            }
            
            existing_assignment = await assignments_col.find_one({"course_id": course_id, "title": assignment["title"]})
            if not existing_assignment:
                await assignments_col.insert_one(assignment)
                print(f"  ✅ Created assignment: {assignment['title']}")
        
        # Create announcements
        announcements_col = db["announcements"]
        for announce_data in course_data.get("announcements", []):
            announcement_id = str(uuid4())
            announcement = {
                "id": announcement_id,
                "_id": announcement_id,
                "course_id": course_id,
                "author_id": instructor_id,
                "title": announce_data["title"],
                "content": announce_data["content"],
                "is_pinned": True,
                "created_at": datetime.utcnow()
            }
            
            existing_announcement = await announcements_col.find_one({"course_id": course_id, "title": announcement["title"]})
            if not existing_announcement:
                await announcements_col.insert_one(announcement)
                print(f"  ✅ Created announcement: {announcement['title']}")
    
    print("\n🎉 Content seeding completed successfully!")
    print(f"📚 Created {len(courses_data)} courses with modules, lessons, quizzes, and assignments")
    print(f"👨‍🏫 Instructor login: instructor@inclusive.edu / instructor123")

if __name__ == "__main__":
    asyncio.run(seed_all_content())
