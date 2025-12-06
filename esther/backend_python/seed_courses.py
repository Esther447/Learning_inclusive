"""
Seed script to populate MongoDB with complete course content
Run: python seed_courses.py
"""
import asyncio
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mongodb_db import get_courses_collection

COURSES_DATA = [
    {
        "id": "1",
        "title": "Web Development Fundamentals",
        "description": "Master web development from scratch with HTML, CSS, and JavaScript",
        "category": "technology",
        "difficulty": "beginner",
        "duration_hours": 40,
        "instructor_id": "mentor1",
        "is_published": True,
        "accessibility_features": ["screen-reader", "captions", "text-to-speech"],
        "modules": [
            {
                "id": "m1",
                "title": "Introduction to Web Development",
                "order": 1,
                "lessons": [
                    {
                        "id": "l1-1",
                        "title": "What is the Web?",
                        "type": "video",
                        "duration": 15,
                        "content": "The web is a system of interconnected documents and resources. Learn how browsers, servers, and HTTP work together to deliver content.",
                        "video_url": "https://youtu.be/zJSY8tbf_ys",
                        "example": "Client -> HTTP Request -> Server\nServer -> HTTP Response -> Client"
                    },
                    {
                        "id": "l1-2",
                        "title": "How Websites Work",
                        "type": "text",
                        "duration": 20,
                        "content": "Websites consist of HTML (structure), CSS (styling), and JavaScript (interactivity). The browser requests files from a server and renders them.",
                        "resources": ["https://developer.mozilla.org/en-US/docs/Learn"]
                    },
                    {
                        "id": "l1-3",
                        "title": "Development Tools Setup",
                        "type": "video",
                        "duration": 25,
                        "content": "Install VS Code, browser dev tools, and essential extensions for web development.",
                        "video_url": "https://youtu.be/DPnqb74Smug",
                        "downloadables": ["VS Code Setup Guide.pdf", "Essential Extensions List.pdf"]
                    }
                ]
            },
            {
                "id": "m2",
                "title": "HTML Essentials",
                "order": 2,
                "lessons": [
                    {
                        "id": "l2-1",
                        "title": "Basic HTML Tags",
                        "type": "video",
                        "duration": 30,
                        "content": "Learn essential HTML tags: headings, paragraphs, links, images, and lists.",
                        "video_url": "https://youtu.be/pQN-pnXPaVg",
                        "example": "<h1>Heading</h1>\n<p>Paragraph</p>\n<a href='#'>Link</a>"
                    },
                    {
                        "id": "l2-2",
                        "title": "HTML Forms",
                        "type": "text",
                        "duration": 35,
                        "content": "Create interactive forms with input fields, buttons, and validation.",
                        "example": "<form>\n  <input type='text' name='username'>\n  <button>Submit</button>\n</form>",
                        "resources": ["https://www.w3schools.com/html/"]
                    },
                    {
                        "id": "l2-3",
                        "title": "Semantic HTML",
                        "type": "text",
                        "duration": 20,
                        "content": "Use semantic tags like <header>, <nav>, <main>, <article> for better accessibility and SEO.",
                        "resources": ["https://www.a11yproject.com/"]
                    }
                ]
            },
            {
                "id": "m3",
                "title": "CSS Foundations",
                "order": 3,
                "lessons": [
                    {
                        "id": "l3-1",
                        "title": "CSS Selectors & Properties",
                        "type": "text",
                        "duration": 30,
                        "content": "Master CSS selectors (class, id, element) and common properties (color, font, margin, padding).",
                        "example": ".class { color: blue; }\n#id { font-size: 20px; }"
                    },
                    {
                        "id": "l3-2",
                        "title": "Flexbox Layout",
                        "type": "video",
                        "duration": 40,
                        "content": "Create flexible, responsive layouts with Flexbox.",
                        "video_url": "https://youtu.be/1Rs2ND1ryYc",
                        "example": ".container { display: flex; justify-content: center; }"
                    },
                    {
                        "id": "l3-3",
                        "title": "Responsive Design",
                        "type": "video",
                        "duration": 35,
                        "content": "Build websites that work on all devices using media queries.",
                        "video_url": "https://youtu.be/0xMQfnTU6oo"
                    }
                ]
            },
            {
                "id": "m4",
                "title": "JavaScript Basics",
                "order": 4,
                "lessons": [
                    {
                        "id": "l4-1",
                        "title": "Variables and Data Types",
                        "type": "video",
                        "duration": 25,
                        "content": "Learn about variables (let, const), strings, numbers, booleans, and arrays.",
                        "video_url": "https://youtu.be/hdI2bqOjy3c",
                        "example": "let name = 'John';\nconst age = 25;\nlet isStudent = true;"
                    },
                    {
                        "id": "l4-2",
                        "title": "Functions",
                        "type": "text",
                        "duration": 30,
                        "content": "Create reusable code with functions. Learn parameters, return values, and arrow functions.",
                        "example": "function greet(name) {\n  return `Hello ${name}`;\n}"
                    },
                    {
                        "id": "l4-3",
                        "title": "DOM Manipulation",
                        "type": "text",
                        "duration": 40,
                        "content": "Select and modify HTML elements using JavaScript.",
                        "example": "document.querySelector('.btn').addEventListener('click', () => {});"
                    }
                ]
            },
            {
                "id": "m5",
                "title": "Final Project",
                "order": 5,
                "lessons": [
                    {
                        "id": "l5-1",
                        "title": "Build Your Portfolio Website",
                        "type": "project",
                        "duration": 120,
                        "content": "Create a 3-page responsive portfolio website using HTML, CSS, and JavaScript. Include: Home, About, and Contact pages.",
                        "downloadables": ["Project Requirements.pdf", "Design Mockup.pdf"]
                    }
                ]
            }
        ]
    },
    {
        "id": "2",
        "title": "Digital Literacy Essentials",
        "description": "Master essential computer and internet skills for the modern world",
        "category": "literacy",
        "difficulty": "beginner",
        "duration_hours": 20,
        "instructor_id": "mentor2",
        "is_published": True,
        "accessibility_features": ["simplified-ui", "captions", "text-to-speech"],
        "modules": [
            {
                "id": "m1",
                "title": "Using a Computer",
                "order": 1,
                "lessons": [
                    {
                        "id": "l1-1",
                        "title": "What is a Computer?",
                        "type": "video",
                        "duration": 15,
                        "content": "A computer is an electronic device that processes information. Learn about hardware (keyboard, mouse, monitor) and software (programs).",
                        "video_url": "https://youtu.be/TgkSyA7Essw"
                    },
                    {
                        "id": "l1-2",
                        "title": "Operating Systems Basics",
                        "type": "text",
                        "duration": 20,
                        "content": "Learn to navigate Windows, Mac, or Linux. Understand files, folders, and basic settings.",
                        "resources": ["https://edu.gcfglobal.org/en/"]
                    },
                    {
                        "id": "l1-3",
                        "title": "File Management",
                        "type": "text",
                        "duration": 25,
                        "content": "Create, rename, move, and delete files and folders. Organize your documents effectively."
                    }
                ]
            },
            {
                "id": "m2",
                "title": "Internet Basics",
                "order": 2,
                "lessons": [
                    {
                        "id": "l2-1",
                        "title": "Using Web Browsers",
                        "type": "video",
                        "duration": 20,
                        "content": "Navigate the internet using browsers like Chrome, Firefox, or Edge. Learn about tabs, bookmarks, and history.",
                        "video_url": "https://youtu.be/1Z7fYkKjaC4"
                    },
                    {
                        "id": "l2-2",
                        "title": "Search Skills",
                        "type": "text",
                        "duration": 15,
                        "content": "Master Google search techniques. Use keywords, quotes, and filters to find information quickly."
                    },
                    {
                        "id": "l2-3",
                        "title": "Internet Safety",
                        "type": "text",
                        "duration": 25,
                        "content": "Stay safe online. Recognize scams, create strong passwords, and protect your privacy.",
                        "resources": ["https://staysafeonline.org"]
                    }
                ]
            },
            {
                "id": "m3",
                "title": "Productivity Tools",
                "order": 3,
                "lessons": [
                    {
                        "id": "l3-1",
                        "title": "Google Docs Basics",
                        "type": "video",
                        "duration": 30,
                        "content": "Create and edit documents online. Learn formatting, sharing, and collaboration.",
                        "video_url": "https://youtu.be/ww3d6A9Y8aQ"
                    },
                    {
                        "id": "l3-2",
                        "title": "Email Essentials",
                        "type": "text",
                        "duration": 20,
                        "content": "Send, receive, and organize emails. Write professional messages and manage attachments."
                    }
                ]
            }
        ]
    },
    {
        "id": "3",
        "title": "Communication Skills for Success",
        "description": "Develop effective communication skills for personal and professional growth",
        "category": "soft_skills",
        "difficulty": "beginner",
        "duration_hours": 25,
        "instructor_id": "mentor3",
        "is_published": True,
        "accessibility_features": ["captions", "sign-language", "text-to-speech"],
        "modules": [
            {
                "id": "m1",
                "title": "Fundamentals of Communication",
                "order": 1,
                "lessons": [
                    {
                        "id": "l1-1",
                        "title": "Verbal & Non-Verbal Communication",
                        "type": "text",
                        "duration": 20,
                        "content": "Communication includes words (verbal) and body language (non-verbal). Learn to use both effectively."
                    },
                    {
                        "id": "l1-2",
                        "title": "Active Listening Skills",
                        "type": "text",
                        "duration": 25,
                        "content": "Listening is as important as speaking. Practice active listening techniques to understand others better."
                    }
                ]
            },
            {
                "id": "m2",
                "title": "Public Speaking",
                "order": 2,
                "lessons": [
                    {
                        "id": "l2-1",
                        "title": "Preparing a Speech",
                        "type": "text",
                        "duration": 30,
                        "content": "Structure your speech with an introduction, body, and conclusion. Know your audience and purpose."
                    },
                    {
                        "id": "l2-2",
                        "title": "Overcoming Fear",
                        "type": "video",
                        "duration": 20,
                        "content": "Learn techniques to manage nervousness and speak confidently in public.",
                        "video_url": "https://youtu.be/pN34FNbOKXc"
                    }
                ]
            },
            {
                "id": "m3",
                "title": "Workplace Communication",
                "order": 3,
                "lessons": [
                    {
                        "id": "l3-1",
                        "title": "Professional Email Writing",
                        "type": "text",
                        "duration": 25,
                        "content": "Write clear, professional emails. Learn proper greetings, structure, and tone.",
                        "example": "Subject: Meeting Request\n\nDear [Name],\n\nI hope this email finds you well...\n\nBest regards,\n[Your Name]"
                    },
                    {
                        "id": "l3-2",
                        "title": "Team Communication",
                        "type": "text",
                        "duration": 20,
                        "content": "Collaborate effectively in teams. Share ideas, give feedback, and resolve conflicts professionally."
                    }
                ]
            }
        ]
    }
]

async def seed_courses():
    """Seed MongoDB with course data"""
    try:
        courses_col = get_courses_collection()
        
        # Clear existing courses
        await courses_col.delete_many({})
        print("✓ Cleared existing courses")
        
        # Insert new courses
        for course in COURSES_DATA:
            course["created_at"] = datetime.utcnow()
            await courses_col.insert_one(course)
            print(f"✓ Inserted: {course['title']}")
        
        print(f"\n✅ Successfully seeded {len(COURSES_DATA)} courses with complete content!")
        
    except Exception as e:
        print(f"❌ Error seeding courses: {e}")

if __name__ == "__main__":
    asyncio.run(seed_courses())
