# Inclusive Learning Platform - Full LMS Architecture

## 1. Enhanced Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_hash   │
│ name            │
│ role            │
│ avatar_url      │
│ bio             │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        ├──────────────────────────────────────────────────────────┐
        │                                                            │
        ▼                                                            ▼
┌─────────────────┐                                        ┌─────────────────┐
│  Enrollments    │                                        │  Submissions    │
├─────────────────┤                                        ├─────────────────┤
│ id (PK)         │                                        │ id (PK)         │
│ user_id (FK)    │                                        │ user_id (FK)    │
│ course_id (FK)  │                                        │ assignment_id   │
│ enrolled_at     │                                        │ content         │
│ status          │                                        │ file_url        │
│ progress_pct    │                                        │ grade           │
│ completed_at    │                                        │ feedback        │
└─────────────────┘                                        │ submitted_at    │
        │                                                  └─────────────────┘
        │ N:1
        ▼
┌─────────────────┐
│    Courses      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ category_id(FK) │
│ instructor_id   │
│ cover_image     │
│ difficulty      │
│ duration_hours  │
│ prerequisites   │
│ learning_outcomes│
│ tags            │
│ is_published    │
│ created_at      │
└─────────────────┘
        │
        │ 1:N
        ├──────────────────────────────────────────────────────────┐
        │                                                            │
        ▼                                                            ▼
┌─────────────────┐                                        ┌─────────────────┐
│    Modules      │                                        │  Announcements  │
├─────────────────┤                                        ├─────────────────┤
│ id (PK)         │                                        │ id (PK)         │
│ course_id (FK)  │                                        │ course_id (FK)  │
│ title           │                                        │ title           │
│ description     │                                        │ content         │
│ order_index     │                                        │ author_id (FK)  │
│ learning_obj    │                                        │ created_at      │
│ duration_mins   │                                        │ is_pinned       │
└─────────────────┘                                        └─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│    Lessons      │
├─────────────────┤
│ id (PK)         │
│ module_id (FK)  │
│ title           │
│ lesson_type     │
│ content         │
│ video_url       │
│ duration_mins   │
│ order_index     │
│ resources       │
│ is_free_preview │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│ LessonProgress  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ lesson_id (FK)  │
│ completed       │
│ time_spent      │
│ last_position   │
│ completed_at    │
└─────────────────┘

┌─────────────────┐
│   Categories    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ description     │
│ icon            │
│ parent_id (FK)  │
└─────────────────┘

┌─────────────────┐
│   Resources     │
├─────────────────┤
│ id (PK)         │
│ lesson_id (FK)  │
│ module_id (FK)  │
│ title           │
│ description     │
│ resource_type   │
│ file_url        │
│ external_link   │
│ order_index     │
└─────────────────┘

┌─────────────────┐
│   Assignments   │
├─────────────────┤
│ id (PK)         │
│ course_id (FK)  │
│ module_id (FK)  │
│ title           │
│ description     │
│ due_date        │
│ points          │
│ submission_type │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│     Quizzes     │
├─────────────────┤
│ id (PK)         │
│ course_id (FK)  │
│ module_id (FK)  │
│ title           │
│ description     │
│ time_limit      │
│ passing_score   │
│ attempts_allowed│
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│   Questions     │
├─────────────────┤
│ id (PK)         │
│ quiz_id (FK)    │
│ question_text   │
│ question_type   │
│ options         │
│ correct_answer  │
│ points          │
│ explanation     │
└─────────────────┘

┌─────────────────┐
│  Discussions    │
├─────────────────┤
│ id (PK)         │
│ course_id (FK)  │
│ user_id (FK)    │
│ title           │
│ content         │
│ is_pinned       │
│ created_at      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│     Replies     │
├─────────────────┤
│ id (PK)         │
│ discussion_id   │
│ user_id (FK)    │
│ content         │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│     Grades      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ course_id (FK)  │
│ assignment_id   │
│ quiz_id (FK)    │
│ score           │
│ max_score       │
│ percentage      │
│ graded_at       │
│ graded_by (FK)  │
└─────────────────┘

┌─────────────────┐
│  Certificates   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ course_id (FK)  │
│ issued_at       │
│ certificate_url │
│ verification_id │
└─────────────────┘

┌─────────────────┐
│   Notifications │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ title           │
│ message         │
│ type            │
│ is_read         │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│    Calendar     │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ course_id (FK)  │
│ title           │
│ description     │
│ event_type      │
│ start_date      │
│ end_date        │
└─────────────────┘
```

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile App  │  │  Admin Panel │      │
│  │  (React TS)  │  │  (Optional)  │  │   (React)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Load Balancer               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer (FastAPI)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication Service (JWT)                        │   │
│  │  Course Management Service                           │   │
│  │  Enrollment Service                                  │   │
│  │  Content Delivery Service                            │   │
│  │  Assessment Service (Quizzes/Assignments)            │   │
│  │  Grading Service                                     │   │
│  │  Discussion Service                                  │   │
│  │  Notification Service                                │   │
│  │  Analytics Service                                   │   │
│  │  Accessibility Service                               │   │
│  │  Certificate Service                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │   MongoDB    │  │    Redis     │      │
│  │  (Relational)│  │  (Documents) │  │   (Cache)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Storage Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   AWS S3     │  │  Cloudinary  │  │  Local Files │      │
│  │  (Videos)    │  │   (Images)   │  │    (Dev)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 3. Student User Journey

```
Login/Register
    │
    ▼
Dashboard (Home)
    │
    ├─→ Continue Learning (Recent Courses)
    ├─→ Upcoming Assignments
    ├─→ Announcements
    ├─→ Calendar Events
    └─→ Progress Overview
    │
    ▼
Browse All Courses
    │
    ├─→ Filter by Category
    ├─→ Search Courses
    └─→ View Course Details
        │
        ▼
    Enroll in Course
        │
        ▼
    Course Home Page
        │
        ├─→ Smart Search
        ├─→ Announcements
        ├─→ Assignments
        ├─→ Discussions
        ├─→ Pages
        ├─→ Syllabus
        ├─→ Quizzes
        ├─→ Modules
        │   │
        │   ▼
        │   Lessons
        │       │
        │       ├─→ Video Lessons
        │       ├─→ Reading Materials
        │       ├─→ Interactive Content
        │       └─→ Mark Complete
        │
        ├─→ Collaborations
        ├─→ Google Drive
        ├─→ Grades
        └─→ Badges/Certificates
```

## 4. Navigation Structure

### Global Navigation (Logged-in Students)
- Dashboard
- Courses
- Calendar
- Inbox/Messages
- Account
- History
- Help & Support

### Course Navigation (Inside a Course)
- Home
- Smart Search
- Announcements
- Assignments
- Discussions
- Pages
- Syllabus
- Quizzes
- Modules
- Collaborations
- Google Drive
- Grades
- Badges

## 5. Key Features Breakdown

### A. Dashboard Features
- Course cards with progress bars
- Continue learning section
- Upcoming assignments widget
- Recent announcements
- Calendar integration
- Quick search
- Personalized recommendations
- Activity feed

### B. Course Features
- Hierarchical content (Course → Module → Lesson)
- Multiple content types (video, text, interactive, PDF)
- Progress tracking per lesson
- Resource attachments
- Prerequisites management
- Learning outcomes display
- Instructor information

### C. Assessment Features
- Quizzes with multiple question types
- Assignments with file uploads
- Automated grading for quizzes
- Manual grading for assignments
- Rubrics support
- Feedback system
- Grade book

### D. Collaboration Features
- Discussion forums per course
- Threaded replies
- Pinned discussions
- Real-time notifications
- Mentorship groups
- Peer review system

### E. Accessibility Features (Maintained)
- Text-to-speech
- Screen reader optimization
- Keyboard navigation
- High contrast mode
- Captions for videos
- Sign language support
- Cognitive-friendly UI
- Voice commands

## 6. Multi-tenant Considerations

### Institution Model
```
┌─────────────────┐
│  Institutions   │
├─────────────────┤
│ id (PK)         │
│ name            │
│ domain          │
│ logo            │
│ settings        │
│ subscription    │
│ created_at      │
└─────────────────┘
```

- Add `institution_id` to Users, Courses tables
- Tenant isolation at database level
- Custom branding per institution
- Separate admin dashboards
- Usage analytics per tenant

## 7. Scalability Recommendations

1. **Caching Strategy**
   - Redis for session management
   - Cache course content
   - Cache user progress data

2. **Database Optimization**
   - Index frequently queried fields
   - Partition large tables
   - Use read replicas

3. **Content Delivery**
   - CDN for static assets
   - Video streaming optimization
   - Lazy loading for content

4. **Microservices (Future)**
   - Separate video processing service
   - Separate notification service
   - Separate analytics service

5. **Load Balancing**
   - Horizontal scaling of API servers
   - Database connection pooling
   - Queue system for background jobs
