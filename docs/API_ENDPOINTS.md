# Complete API Endpoints for LMS

## Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/logout            - Logout user
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
```

## Users
```
GET    /api/users/me               - Get current user profile
PUT    /api/users/me               - Update current user profile
GET    /api/users/{id}             - Get user by ID
PUT    /api/users/{id}/avatar      - Upload user avatar
GET    /api/users/{id}/badges      - Get user badges
GET    /api/users/{id}/certificates - Get user certificates
```

## Categories
```
GET    /api/categories             - List all categories
GET    /api/categories/{id}        - Get category by ID
POST   /api/categories             - Create category (admin)
PUT    /api/categories/{id}        - Update category (admin)
DELETE /api/categories/{id}        - Delete category (admin)
```

## Courses
```
GET    /api/courses                - List all published courses
GET    /api/courses/{id}           - Get course details
POST   /api/courses                - Create course (instructor/admin)
PUT    /api/courses/{id}           - Update course (instructor/admin)
DELETE /api/courses/{id}           - Delete course (admin)
GET    /api/courses/{id}/syllabus  - Get course syllabus
GET    /api/courses/{id}/students  - Get enrolled students (instructor)
POST   /api/courses/{id}/publish   - Publish course (instructor)
GET    /api/courses/search         - Search courses
GET    /api/courses/recommended    - Get recommended courses
```

## Modules
```
GET    /api/courses/{courseId}/modules           - List course modules
GET    /api/modules/{id}                         - Get module details
POST   /api/courses/{courseId}/modules           - Create module (instructor)
PUT    /api/modules/{id}                         - Update module (instructor)
DELETE /api/modules/{id}                         - Delete module (instructor)
PUT    /api/modules/{id}/reorder                 - Reorder module (instructor)
```

## Lessons
```
GET    /api/modules/{moduleId}/lessons           - List module lessons
GET    /api/lessons/{id}                         - Get lesson details
POST   /api/modules/{moduleId}/lessons           - Create lesson (instructor)
PUT    /api/lessons/{id}                         - Update lesson (instructor)
DELETE /api/lessons/{id}                         - Delete lesson (instructor)
POST   /api/lessons/{id}/complete                - Mark lesson complete
GET    /api/lessons/{id}/next                    - Get next lesson
```

## Resources
```
GET    /api/lessons/{lessonId}/resources         - List lesson resources
GET    /api/modules/{moduleId}/resources         - List module resources
POST   /api/lessons/{lessonId}/resources         - Add resource to lesson
POST   /api/modules/{moduleId}/resources         - Add resource to module
DELETE /api/resources/{id}                       - Delete resource
POST   /api/resources/upload                     - Upload resource file
```

## Enrollments
```
GET    /api/enrollments                          - Get user enrollments
POST   /api/enrollments                          - Enroll in course
DELETE /api/enrollments/{id}                     - Unenroll from course
GET    /api/enrollments/{id}/progress            - Get enrollment progress
```

## Progress
```
GET    /api/progress/courses/{courseId}          - Get course progress
POST   /api/progress/lessons/{lessonId}          - Update lesson progress
GET    /api/progress/dashboard                   - Get dashboard progress data
```

## Assignments
```
GET    /api/courses/{courseId}/assignments       - List course assignments
GET    /api/assignments/{id}                     - Get assignment details
POST   /api/courses/{courseId}/assignments       - Create assignment (instructor)
PUT    /api/assignments/{id}                     - Update assignment (instructor)
DELETE /api/assignments/{id}                     - Delete assignment (instructor)
GET    /api/assignments/{id}/submissions         - Get all submissions (instructor)
POST   /api/assignments/{id}/submit              - Submit assignment
GET    /api/assignments/upcoming                 - Get upcoming assignments
```

## Submissions
```
GET    /api/submissions/{id}                     - Get submission details
PUT    /api/submissions/{id}/grade               - Grade submission (instructor)
POST   /api/submissions/{id}/feedback            - Add feedback (instructor)
GET    /api/users/me/submissions                 - Get my submissions
```

## Quizzes
```
GET    /api/courses/{courseId}/quizzes           - List course quizzes
GET    /api/quizzes/{id}                         - Get quiz details
POST   /api/courses/{courseId}/quizzes           - Create quiz (instructor)
PUT    /api/quizzes/{id}                         - Update quiz (instructor)
DELETE /api/quizzes/{id}                         - Delete quiz (instructor)
POST   /api/quizzes/{id}/start                   - Start quiz attempt
POST   /api/quizzes/{id}/submit                  - Submit quiz attempt
GET    /api/quizzes/{id}/attempts                - Get quiz attempts
GET    /api/quizzes/{id}/results                 - Get quiz results
```

## Questions
```
GET    /api/quizzes/{quizId}/questions           - List quiz questions
POST   /api/quizzes/{quizId}/questions           - Add question (instructor)
PUT    /api/questions/{id}                       - Update question (instructor)
DELETE /api/questions/{id}                       - Delete question (instructor)
```

## Grades
```
GET    /api/courses/{courseId}/grades            - Get course grades
GET    /api/users/{userId}/grades                - Get user grades
GET    /api/grades/summary                       - Get grades summary
POST   /api/grades                               - Create/update grade (instructor)
```

## Announcements
```
GET    /api/courses/{courseId}/announcements     - List course announcements
GET    /api/announcements/{id}                   - Get announcement details
POST   /api/courses/{courseId}/announcements     - Create announcement (instructor)
PUT    /api/announcements/{id}                   - Update announcement (instructor)
DELETE /api/announcements/{id}                   - Delete announcement (instructor)
POST   /api/announcements/{id}/pin               - Pin announcement (instructor)
```

## Discussions
```
GET    /api/courses/{courseId}/discussions       - List course discussions
GET    /api/discussions/{id}                     - Get discussion details
POST   /api/courses/{courseId}/discussions       - Create discussion
PUT    /api/discussions/{id}                     - Update discussion
DELETE /api/discussions/{id}                     - Delete discussion
POST   /api/discussions/{id}/pin                 - Pin discussion (instructor)
POST   /api/discussions/{id}/lock                - Lock discussion (instructor)
```

## Discussion Replies
```
GET    /api/discussions/{discussionId}/replies   - List discussion replies
POST   /api/discussions/{discussionId}/replies   - Add reply
PUT    /api/replies/{id}                         - Update reply
DELETE /api/replies/{id}                         - Delete reply
```

## Pages
```
GET    /api/courses/{courseId}/pages             - List course pages
GET    /api/pages/{id}                           - Get page details
POST   /api/courses/{courseId}/pages             - Create page (instructor)
PUT    /api/pages/{id}                           - Update page (instructor)
DELETE /api/pages/{id}                           - Delete page (instructor)
```

## Certificates
```
GET    /api/certificates/{id}                    - Get certificate
POST   /api/courses/{courseId}/certificate       - Generate certificate
GET    /api/certificates/verify/{code}           - Verify certificate
GET    /api/users/me/certificates                - Get my certificates
```

## Notifications
```
GET    /api/notifications                        - List user notifications
PUT    /api/notifications/{id}/read              - Mark notification as read
PUT    /api/notifications/read-all               - Mark all as read
DELETE /api/notifications/{id}                   - Delete notification
GET    /api/notifications/unread-count           - Get unread count
```

## Calendar
```
GET    /api/calendar/events                      - List calendar events
GET    /api/calendar/events/{id}                 - Get event details
POST   /api/calendar/events                      - Create event
PUT    /api/calendar/events/{id}                 - Update event
DELETE /api/calendar/events/{id}                 - Delete event
GET    /api/calendar/upcoming                    - Get upcoming events
```

## Reviews
```
GET    /api/courses/{courseId}/reviews           - List course reviews
POST   /api/courses/{courseId}/reviews           - Add review
PUT    /api/reviews/{id}                         - Update review
DELETE /api/reviews/{id}                         - Delete review
```

## Badges
```
GET    /api/badges                               - List all badges
GET    /api/badges/{id}                          - Get badge details
POST   /api/badges                               - Create badge (admin)
POST   /api/users/{userId}/badges/{badgeId}      - Award badge (admin)
```

## Analytics (Instructor/Admin)
```
GET    /api/analytics/courses/{courseId}         - Course analytics
GET    /api/analytics/students/{userId}          - Student analytics
GET    /api/analytics/dashboard                  - Dashboard analytics
GET    /api/analytics/engagement                 - Engagement metrics
```

## Search
```
GET    /api/search                               - Global search
GET    /api/search/courses                       - Search courses
GET    /api/search/lessons                       - Search lessons
GET    /api/search/discussions                   - Search discussions
```

## Accessibility
```
GET    /api/accessibility/settings               - Get accessibility settings
PUT    /api/accessibility/settings               - Update accessibility settings
POST   /api/accessibility/tts                    - Text-to-speech conversion
```

## Admin
```
GET    /api/admin/users                          - List all users
PUT    /api/admin/users/{id}/role                - Update user role
DELETE /api/admin/users/{id}                     - Delete user
GET    /api/admin/stats                          - Platform statistics
GET    /api/admin/reports                        - Generate reports
```

## File Upload
```
POST   /api/upload/image                         - Upload image
POST   /api/upload/video                         - Upload video
POST   /api/upload/document                      - Upload document
POST   /api/upload/avatar                        - Upload avatar
```

## Health & Monitoring
```
GET    /api/health                               - Health check
GET    /api/version                              - API version
```
