# esther/backend_python/main.py
import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# ------------------ Path Setup ------------------
# Ensure the project root is in sys.path for 'backend_python' imports to work
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# ------------------ Imports ------------------
from backend_python.config import settings
from backend_python.database import engine, Base, client as mongo_client
from backend_python.exceptions import ResourceNotFoundException, BadRequestException, UnauthorizedException
from backend_python.routers import (
    auth, users, courses, accessibility,
    admin, enrollments, mentorship, progress, quizzes
)

# ------------------ Lifespan (Startup/Shutdown) ------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        # Verify MongoDB Connection
        await mongo_client.admin.command('ping')
        print("✅ Successfully connected to MongoDB")
        
        # Create SQL Tables
        # Note: In production, use Alembic for migrations instead of create_all
        Base.metadata.create_all(bind=engine)
        print("✅ SQL Tables initialized")
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
    
    yield
    
    # Shutdown
    mongo_client.close()
    print("👋 Shutting down database connections")

# ------------------ App Initialization ------------------
app = FastAPI(
    title="Inclusive Learning Platform API",
    description="Backend API for the Inclusive Learning & Skills Platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# ------------------ Middleware ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Routers ------------------
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(accessibility.router, prefix="/api/accessibility", tags=["Accessibility"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(enrollments.router, prefix="/api/enrollments", tags=["Enrollments"])
app.include_router(mentorship.router, prefix="/api/mentorship", tags=["Mentorship"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["Quizzes"])

# ------------------ Global Exception Handlers ------------------
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
    print(f"Global error: {exc}") # Log the error
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# ------------------ Root & Health ------------------
@app.get("/")
def root():
    return {
        "message": "Inclusive Learning Platform API",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health", tags=["Health"])
def health_check():
    from datetime import datetime
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
