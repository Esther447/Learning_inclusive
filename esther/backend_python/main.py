# main.py
"""
Main FastAPI application for Inclusive Learning Platform
"""
import sys
import os
from contextlib import asynccontextmanager
from typing import List, Optional

# Add the project root to the Python path before any imports
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Import routers
from backend_python.routers import auth

# CORS configuration
cors_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://learning-inclusive-lmke.vercel.app"
]

app = FastAPI(
    title="Inclusive Learning Platform API",
    description="Backend API for the Inclusive Learning Platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "message": "API is running",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the Inclusive Learning Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )