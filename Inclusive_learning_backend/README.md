# Inclusive Learning & Skills Platform - Backend API

A Node.js/Express backend API for an inclusive learning platform designed for people with disabilities.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for learners, mentors, and administrators
- **Accessibility Settings**: Comprehensive accessibility preferences per user
- **Course Management**: CRUD operations for courses with accessibility features
- **Progress Tracking**: Track learner progress through courses
- **Security**: Helmet, CORS, rate limiting, and input validation

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start MongoDB** (make sure MongoDB is running locally or update MONGODB_URI)

4. **Run development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `POST /api/courses` - Create course (mentor/admin only)
- `PUT /api/courses/:id` - Update course (mentor/admin only)

### Health Check
- `GET /api/health` - API health status

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origin