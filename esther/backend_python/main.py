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

from backend_python.database import engine, Base, mongo_client
from backend_python.routers import (
    auth, users, courses, enrollments, progress, 
    accessibility, mentorship, quizzes, admin
)
from backend_python.settings_configuration import settings
from backend_python.exceptions import ResourceNotFoundException, BadRequestException, UnauthorizedException
from sqlalchemy.exc import OperationalError
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ping DB (optional - don't fail if MongoDB isn't available)
    try:
        await mongo_client.admin.command('ping')
        print("✅ Successfully connected to MongoDB")
    except Exception as e:
        print(f"⚠️  Warning: MongoDB not available: {e}. Continuing without MongoDB.")
    print("🚀 Server starting up...")
    yield
    # Shutdown: Close DB connection
    try:
        mongo_client.close()
    except Exception:
        pass
    print("👋 Server shutting down...")


# Instantiate the app once, with the lifespan manager so the MongoDB
# ping and other startup/shutdown logic works as intended.
app = FastAPI(
    title="Inclusive Learning Platform API",
    description="Backend API for the Inclusive Learning & Skills Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
# Get CORS origins from environment variable or use defaults
cors_origins = getattr(settings, 'CORS_ORIGINS', None)

# Handle CORS_ORIGINS - can be string (comma-separated) or list
if cors_origins:
    if isinstance(cors_origins, str):
        # Split comma-separated string into list
        cors_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
    elif not isinstance(cors_origins, list):
        cors_origins = [str(cors_origins)]
else:
    # Default to localhost for development
    cors_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

# Add CORS middleware - must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,  # Use configured origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
    max_age=3600,  # Cache preflight for 1 hour
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(accessibility.router, prefix="/api/accessibility", tags=["Accessibility"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(mentorship.router, prefix="/api/mentorship", tags=["Mentorship"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["Quizzes"])
app.include_router(enrollments.router, prefix="/api/enrollments", tags=["Enrollments"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# ==================== Startup Event ====================
@app.on_event("startup")
def on_startup():
    # Import all models before creating tables
    from backend_python.models import (
        User, Course, Enrollment, AccessibilitySettings,
        Progress, MentorshipGroup, MentorshipMembership
    )
    # Create tables if they do not exist. If the SQL database is unreachable
    # (e.g. wrong credentials or not running), log a friendly warning and
    # continue running so other services (MongoDB, endpoints) remain available.
    try:
        Base.metadata.create_all(bind=engine)
        try:
            # Log the SQL database URL in use (sqlite or postgres)
            print(f"🔗 SQL database url: {engine.url}")
        except Exception:
            print("🔗 SQL database: unknown or not used")
    except OperationalError as e:
        print(f"⚠️  Warning: could not create PostgreSQL tables: {e}")
    except Exception as e:
        # Catch-all in case other errors arise during table creation
        print(f"⚠️  Warning: database setup encountered an unexpected error: {e}")
    print("🚀 Inclusive Learning Platform API started!")
    print(f"📚 Documentation available at: http://localhost:8001/docs")

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

# ==================== CORS Test Endpoint ====================
@app.get("/api/test-cors", tags=["Health"])
def test_cors():
    """Test endpoint to verify CORS is working"""
    return {"message": "CORS is working!", "cors_enabled": True}

# ==================== Global Exception Handlers ====================
def add_cors_headers(response: JSONResponse, request: Request) -> JSONResponse:
    """Add CORS headers to any response"""
    origin = request.headers.get("origin", "*")
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.exception_handler(ResourceNotFoundException)
async def resource_not_found_handler(request: Request, exc: ResourceNotFoundException):
    response = JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    return add_cors_headers(response, request)

@app.exception_handler(BadRequestException)
async def bad_request_handler(request: Request, exc: BadRequestException):
    response = JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    return add_cors_headers(response, request)

@app.exception_handler(UnauthorizedException)
async def unauthorized_handler(request: Request, exc: UnauthorizedException):
    response = JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    return add_cors_headers(response, request)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    response = JSONResponse(status_code=422, content={"detail": exc.errors()})
    return add_cors_headers(response, request)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    response = JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    return add_cors_headers(response, request)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    import traceback
    print(f"Unhandled exception: {exc}")
    print(traceback.format_exc())
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Add OPTIONS handler for CORS preflight (backup, CORS middleware should handle this)
@app.options("/{full_path:path}")
async def options_handler(request: Request, full_path: str):
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "3600",
        }
    )

# ==================== Run Uvicorn ====================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
