# Inclusive Learning & Skills Platform - Backend API

A comprehensive Node.js/Express backend API for an inclusive learning platform designed for people with disabilities.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for learners, mentors, and administrators
- **Comprehensive Accessibility Settings**: 20+ accessibility preferences per user
- **Course Management**: CRUD operations for courses with accessibility features
- **Progress Tracking**: Detailed learner progress through courses and modules
- **Enrollment System**: Course enrollment and completion tracking
- **Dashboard Analytics**: User dashboard with progress statistics
- **Security**: Helmet, CORS, rate limiting, and input validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user with accessibility preferences
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Simple signup for learners

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/:id` - Get specific course
- `POST /api/courses` - Create course (mentor/admin only)
- `PUT /api/courses/:id` - Update course (mentor/admin only)
- `POST /api/courses/:id/enroll` - Enroll in course
- `PUT /api/courses/progress` - Update learning progress

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/accessibility-settings` - Update accessibility settings
- `GET /api/users/dashboard` - Get dashboard data

### Health Check
- `GET /api/health` - API health status

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   - Copy `.env` file and update MongoDB URI and JWT secret

3. **Start MongoDB** (make sure MongoDB is running locally)

4. **Run development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api`

## Accessibility Features

The platform supports comprehensive accessibility settings including:

### Visual Accessibility
- Screen reader support
- Text-to-speech
- High contrast mode
- Adjustable font sizes
- Multiple color themes
- Braille display support

### Hearing Accessibility
- Captions for videos
- Transcripts for audio content
- Sign language video support
- Volume boost controls

### Speech Accessibility
- Voice output
- Symbol-based communication
- Alternative input methods

### Mobility Accessibility
- Keyboard-only navigation
- Voice command navigation
- Switch control support

### Cognitive Accessibility
- Simplified navigation
- Chunked content delivery
- Visual cues
- Reminders and notifications
- Adjustable reading speed

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origin
- `NODE_ENV` - Environment (development/production)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server