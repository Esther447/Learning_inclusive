# Sample Data for LMS

## Sample Categories

```json
[
  {
    "id": "cat-1",
    "name": "Technology & Programming",
    "description": "Learn coding, web development, and software engineering",
    "icon": "💻"
  },
  {
    "id": "cat-2",
    "name": "Vocational Skills",
    "description": "Practical skills for employment",
    "icon": "🔧"
  },
  {
    "id": "cat-3",
    "name": "Soft Skills",
    "description": "Communication, leadership, and teamwork",
    "icon": "🤝"
  },
  {
    "id": "cat-4",
    "name": "Digital Literacy",
    "description": "Basic computer and internet skills",
    "icon": "📱"
  }
]
```

## Sample Course: "Introduction to Web Development"

```json
{
  "id": "course-1",
  "title": "Introduction to Web Development",
  "description": "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This course is designed to be fully accessible for learners with disabilities.",
  "category_id": "cat-1",
  "instructor_id": "instructor-1",
  "cover_image": "/images/courses/web-dev.jpg",
  "difficulty": "beginner",
  "duration_hours": 40,
  "prerequisites": [],
  "learning_outcomes": [
    "Build responsive websites using HTML and CSS",
    "Understand JavaScript fundamentals",
    "Create interactive web pages",
    "Deploy websites to the internet",
    "Follow web accessibility best practices"
  ],
  "tags": ["HTML", "CSS", "JavaScript", "Web Development", "Accessible"],
  "is_published": true,
  "accessibility_features": {
    "captions": true,
    "transcripts": true,
    "sign_language": true,
    "screen_reader_optimized": true,
    "keyboard_navigation": true
  }
}
```

## Sample Modules for Web Development Course

```json
[
  {
    "id": "module-1",
    "course_id": "course-1",
    "title": "Getting Started with HTML",
    "description": "Learn the basics of HTML and create your first web page",
    "order_index": 1,
    "learning_objectives": [
      "Understand HTML structure",
      "Create basic HTML elements",
      "Use semantic HTML tags"
    ],
    "duration_mins": 180
  },
  {
    "id": "module-2",
    "course_id": "course-1",
    "title": "Styling with CSS",
    "description": "Make your websites beautiful with CSS",
    "order_index": 2,
    "learning_objectives": [
      "Apply CSS styles to HTML",
      "Use CSS selectors",
      "Create responsive layouts"
    ],
    "duration_mins": 240
  },
  {
    "id": "module-3",
    "course_id": "course-1",
    "title": "JavaScript Fundamentals",
    "description": "Add interactivity to your websites",
    "order_index": 3,
    "learning_objectives": [
      "Understand JavaScript syntax",
      "Work with variables and functions",
      "Manipulate the DOM"
    ],
    "duration_mins": 300
  }
]
```

## Sample Lessons for Module 1

```json
[
  {
    "id": "lesson-1",
    "module_id": "module-1",
    "title": "What is HTML?",
    "lesson_type": "video",
    "content": "HTML stands for HyperText Markup Language...",
    "video_url": "https://example.com/videos/what-is-html.mp4",
    "duration_mins": 15,
    "order_index": 1,
    "is_free_preview": true,
    "accessibility_content": {
      "captions": "https://example.com/captions/lesson-1.vtt",
      "transcript": "Full text transcript...",
      "sign_language_video": "https://example.com/sign/lesson-1.mp4"
    }
  },
  {
    "id": "lesson-2",
    "module_id": "module-1",
    "title": "HTML Document Structure",
    "lesson_type": "article",
    "content": "<h1>HTML Document Structure</h1><p>Every HTML document has a basic structure...</p>",
    "duration_mins": 20,
    "order_index": 2,
    "is_free_preview": false
  },
  {
    "id": "lesson-3",
    "module_id": "module-1",
    "title": "Common HTML Tags",
    "lesson_type": "interactive",
    "content": "Interactive coding exercise...",
    "duration_mins": 30,
    "order_index": 3,
    "is_free_preview": false
  }
]
```

## Sample Resources

```json
[
  {
    "id": "resource-1",
    "lesson_id": "lesson-1",
    "title": "HTML Cheat Sheet",
    "description": "Quick reference for HTML tags",
    "resource_type": "pdf",
    "file_url": "https://example.com/resources/html-cheatsheet.pdf",
    "file_size": 524288,
    "order_index": 1
  },
  {
    "id": "resource-2",
    "lesson_id": "lesson-1",
    "title": "MDN HTML Documentation",
    "description": "Official HTML documentation",
    "resource_type": "link",
    "external_link": "https://developer.mozilla.org/en-US/docs/Web/HTML",
    "order_index": 2
  }
]
```

## Sample Assignment

```json
{
  "id": "assignment-1",
  "course_id": "course-1",
  "module_id": "module-1",
  "title": "Build Your First Web Page",
  "description": "Create a simple personal portfolio page using HTML",
  "instructions": "1. Create an HTML file\n2. Include header, main, and footer sections\n3. Add your name, bio, and contact information\n4. Use semantic HTML tags\n5. Submit your HTML file",
  "due_date": "2024-02-15T23:59:59Z",
  "points": 100,
  "submission_type": "file",
  "allowed_file_types": ["html", "zip"],
  "max_file_size": 5242880,
  "is_published": true
}
```

## Sample Quiz

```json
{
  "id": "quiz-1",
  "course_id": "course-1",
  "module_id": "module-1",
  "title": "HTML Basics Quiz",
  "description": "Test your knowledge of HTML fundamentals",
  "instructions": "Answer all questions. You have 30 minutes to complete this quiz.",
  "time_limit_minutes": 30,
  "passing_score": 70,
  "attempts_allowed": 2,
  "show_correct_answers": true,
  "shuffle_questions": true,
  "is_published": true
}
```

## Sample Questions

```json
[
  {
    "id": "question-1",
    "quiz_id": "quiz-1",
    "question_text": "What does HTML stand for?",
    "question_type": "multiple_choice",
    "options": [
      {"text": "HyperText Markup Language", "isCorrect": true},
      {"text": "High Tech Modern Language", "isCorrect": false},
      {"text": "Home Tool Markup Language", "isCorrect": false},
      {"text": "Hyperlinks and Text Markup Language", "isCorrect": false}
    ],
    "points": 10,
    "explanation": "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.",
    "order_index": 1
  },
  {
    "id": "question-2",
    "quiz_id": "quiz-1",
    "question_text": "Which tag is used to create a paragraph?",
    "question_type": "multiple_choice",
    "options": [
      {"text": "<p>", "isCorrect": true},
      {"text": "<paragraph>", "isCorrect": false},
      {"text": "<para>", "isCorrect": false},
      {"text": "<text>", "isCorrect": false}
    ],
    "points": 10,
    "explanation": "The <p> tag is used to define a paragraph in HTML.",
    "order_index": 2
  }
]
```

## Sample Announcement

```json
{
  "id": "announcement-1",
  "course_id": "course-1",
  "author_id": "instructor-1",
  "title": "Welcome to Web Development!",
  "content": "Welcome to the Introduction to Web Development course! I'm excited to have you here. Please review the syllabus and complete the first module by the end of this week.",
  "is_pinned": true,
  "created_at": "2024-01-15T10:00:00Z"
}
```

## Sample Discussion

```json
{
  "id": "discussion-1",
  "course_id": "course-1",
  "user_id": "student-1",
  "title": "Best resources for learning HTML?",
  "content": "Hi everyone! I'm looking for additional resources to practice HTML. What websites or books do you recommend?",
  "is_pinned": false,
  "is_locked": false,
  "views_count": 45,
  "replies_count": 8,
  "created_at": "2024-01-20T14:30:00Z"
}
```

## Sample Calendar Event

```json
{
  "id": "event-1",
  "user_id": "student-1",
  "course_id": "course-1",
  "title": "Assignment Due: Build Your First Web Page",
  "description": "Submit your HTML portfolio page",
  "event_type": "assignment",
  "start_date": "2024-02-15T23:59:59Z",
  "end_date": "2024-02-15T23:59:59Z",
  "is_all_day": false
}
```

## Sample Badge

```json
{
  "id": "badge-1",
  "name": "HTML Master",
  "description": "Completed all HTML modules with 90% or higher",
  "icon_url": "/images/badges/html-master.png",
  "criteria": {
    "modules_completed": ["module-1"],
    "min_score": 90
  }
}
```

## Sample Certificate

```json
{
  "id": "cert-1",
  "user_id": "student-1",
  "course_id": "course-1",
  "issued_at": "2024-03-01T12:00:00Z",
  "certificate_url": "https://example.com/certificates/cert-1.pdf",
  "verification_code": "WD-2024-001-ABC123",
  "expires_at": null
}
```

## Sample Notification

```json
{
  "id": "notif-1",
  "user_id": "student-1",
  "title": "New Assignment Posted",
  "message": "Your instructor has posted a new assignment: Build Your First Web Page",
  "type": "assignment",
  "related_id": "assignment-1",
  "related_type": "assignment",
  "is_read": false,
  "created_at": "2024-01-25T09:00:00Z"
}
```

## Sample User Progress

```json
{
  "user_id": "student-1",
  "course_id": "course-1",
  "progress_percentage": 35.5,
  "lessons_completed": 8,
  "total_lessons": 24,
  "time_spent_hours": 12.5,
  "last_accessed": "2024-01-28T15:30:00Z",
  "current_lesson_id": "lesson-9"
}
```

## Sample Grade Summary

```json
{
  "user_id": "student-1",
  "course_id": "course-1",
  "overall_grade": 87.5,
  "letter_grade": "B+",
  "assignments_grade": 90,
  "quizzes_grade": 85,
  "participation_grade": 88,
  "breakdown": [
    {
      "type": "assignment",
      "title": "Build Your First Web Page",
      "score": 90,
      "max_score": 100,
      "weight": 30
    },
    {
      "type": "quiz",
      "title": "HTML Basics Quiz",
      "score": 85,
      "max_score": 100,
      "weight": 20
    }
  ]
}
```
