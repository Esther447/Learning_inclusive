# main.py
"""
Main FastAPI application for Inclusive Learning Platform
"""
import sys
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Add current directory to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
# Ensure project root is on sys.path so `import backend_python.*` works
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend_python.database import engine, Base
from backend_python.routers import users, courses, enrollments, progress, accessibility, mentorship, quizzes, auth
from backend_python.exceptions import ResourceNotFoundException, BadRequestException, UnauthorizedException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import mongo_client, mongo_db, get_db
from routers import (
    auth, users, courses, accessibility,
    admin, enrollments, mentorship, progress, quizzes
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ping DB
    try:
        await mongo_client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
    yield
    # Shutdown: Close DB connection
    mongo_client.close()

app = FastAPI(lifespan=lifespan)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(accessibility.router, prefix="/api/accessibility", tags=["Accessibility"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(enrollments.router, prefix="/api/enrollments", tags=["Enrollments"])
app.include_router(mentorship.router, prefix="/api/mentorship", tags=["Mentorship"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["Quizzes"])

@app.get("/")
async def root():
    return {"message": "Welcome to Inclusive Learning API"}

app = FastAPI(
    title="Inclusive Learning Platform API",
    description="Backend API for the Inclusive Learning & Skills Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ==================== Configure CORS ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Include Routers ====================
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(accessibility.router, prefix="/api/accessibility", tags=["Accessibility"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(mentorship.router, prefix="/api/mentorship", tags=["Mentorship"])

# ==================== Startup Event ====================
@app.on_event("startup")
def on_startup():
    # Import all models before creating tables
    from backend_python.models import (
        User, Course, Enrollment, AccessibilitySettings,
        Progress, MentorshipGroup, MentorshipMembership
    )
    # Create tables if they do not exist
    Base.metadata.create_all(bind=engine)
    print("🚀 Inclusive Learning Platform API started!")
    print(f"📚 Documentation available at: http://localhost:8000/docs")

# ==================== Shutdown Event ====================
@app.on_event("shutdown")
async def shutdown_event():
    print("👋 Shutting down Inclusive Learning Platform API")

# ==================== Root Endpoint ====================
@app.get("/")
def root():
    return {
        "message": "Inclusive Learning Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth",
            "users": "/api/users",
            "courses": "/api/courses",
            "progress": "/api/progress",
            "accessibility": "/api/accessibility",
            "mentorship": "/api/mentorship"
        }
    }

# ==================== Health Check ====================
@app.get("/api/health", tags=["Health"])
def health_check():
    from datetime import datetime
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0"
    }

# ==================== Global Exception Handlers ====================
@app.exception_handler(ResourceNotFoundException)
async def resource_not_found_handler(request: Request, exc: ResourceNotFoundException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(BadRequestException)
async def bad_request_handler(request: Request, exc: BadRequestException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(UnauthorizedException)
async def unauthorized_handler(request: Request, exc: UnauthorizedException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# ==================== Run Uvicorn ====================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
