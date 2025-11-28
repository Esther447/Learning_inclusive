# Inclusive Learning Platform - API Documentation

## Overview
This backend API provides comprehensive support for an inclusive learning platform designed specifically for people with disabilities. It includes advanced accessibility features, user management, course delivery, and progress tracking.

## Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Learner, Mentor, Administrator)
- Secure password hashing with bcrypt

### ♿ Accessibility Features
The platform supports 20+ accessibility settings:

**Visual Accessibility:**
- Screen reader support
- Text-to-speech functionality
- High contrast mode
- Adjustable font sizes (small, medium, large, extra-large)
- Multiple color themes (default, high-contrast, dark, light)
- Braille display support

**Hearing Accessibility:**
- Video captions
- Audio transcripts
- Sign language video support
- Volume boost controls (0-100%)

**Speech Accessibility:**
- Voice output functionality
- Symbol-based communication
- Alternative input methods

**Mobility Accessibility:**
- Keyboard-only navigation
- Voice command navigation
- Switch control support

**Cognitive Accessibility:**
- Simplified navigation interface
- Chunked content delivery
- Visual cues and indicators
- Reminder notifications
- Adjustable reading speed (slow, normal, fast)

### 📚 Course Management
- Course creation and management
- Module-based content structure
- Multiple content types (text, video, audio, interactive, quiz)
- Accessibility metadata for all content
- Category-based organization (technology, vocational, soft-skills, literacy)
- Difficulty levels (beginner, intermediate, advanced)

### 📊 Progress Tracking
- Detailed learning progress per course/module
- Completion percentage tracking
- Last accessed timestamps
- Completed modules tracking
- Quiz scores and assessments

### 👥 User Management
- Comprehensive user profiles
- Disability type tracking
- Personalized accessibility settings
- Course enrollment system
- Certification management

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user with accessibility preferences.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "learner",
  "disabilityType": ["visual", "hearing"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "learner",
      "accessibilitySettings": { ... },
      "enrolledCourses": [],
      "progress": [],
      "certifications": []
    }
  }
}
```

#### POST /api/auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/signup
Simple signup for learners (simplified registration).

### Course Endpoints

#### GET /api/courses
Get all courses with optional filtering.

**Query Parameters:**
- `category`: Filter by course category
- `difficulty`: Filter by difficulty level
- `accessibility`: Filter by accessibility features

#### GET /api/courses/:id
Get specific course details.

#### POST /api/courses
Create new course (Mentor/Admin only).

#### PUT /api/courses/:id
Update existing course (Mentor/Admin only).

#### POST /api/courses/:id/enroll
Enroll current user in a course.

#### PUT /api/courses/progress
Update learning progress.

**Request Body:**
```json
{
  "courseId": "course_id",
  "moduleId": "module_id",
  "completionPercentage": 75,
  "completedModules": ["module1", "module2"]
}
```

### User Endpoints

#### GET /api/users/profile
Get current user's profile.

#### PUT /api/users/profile
Update user profile information.

#### PUT /api/users/accessibility-settings
Update accessibility preferences.

**Request Body:**
```json
{
  "screenReaderEnabled": true,
  "textToSpeechEnabled": true,
  "highContrastMode": true,
  "fontSize": "large",
  "colorTheme": "high-contrast",
  "captionsEnabled": true,
  "keyboardOnlyNavigation": true,
  "simplifiedNavigation": true,
  "readingSpeed": "slow"
}
```

#### GET /api/users/dashboard
Get dashboard analytics and statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "enrolledCoursesCount": 5,
    "completedCoursesCount": 2,
    "certificationsCount": 1,
    "recentProgress": [ ... ]
  }
}
```

## Sample Data

The API includes sample data for testing:

**Sample Accounts:**
- Mentor: `mentor@example.com` / `password123`
- Learner: `learner@example.com` / `password123`

**Sample Courses:**
- Introduction to Web Development (Technology)
- Digital Literacy for Everyone (Literacy)

## Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- JWT token expiration
- Password hashing with bcrypt
- Input validation and sanitization

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "message": "Additional context (development only)"
}
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up MongoDB connection in `.env`
3. Run development server: `npm run dev`
4. API available at: `http://localhost:3000/api`
5. Test with sample accounts or create new users

## Testing

Use the included `test-api.js` script to verify all endpoints:
```bash
node test-api.js
```

This comprehensive API provides a solid foundation for building an inclusive learning platform that truly serves users with diverse accessibility needs.