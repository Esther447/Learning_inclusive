@echo off
REM Batch script to run the backend server on Windows
REM Make sure you're in the esther directory when running this

echo.
echo 🚀 Starting Inclusive Learning Platform Backend...
echo.

REM Check if we're in the right directory
cd /d "%~dp0\.."
if not exist "backend_python\main.py" (
    echo ⚠️  Error: Could not find backend_python\main.py
    echo    Make sure you're running this from the esther directory
    pause
    exit /b 1
)

REM Get port from environment variable or use default
if "%PORT%"=="" (
    set PORT=8001
)

echo 📡 Starting server on http://localhost:%PORT%
echo 📚 API Documentation: http://localhost:%PORT%/docs
echo 🔍 ReDoc: http://localhost:%PORT%/redoc
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn backend_python.main:app --host 0.0.0.0 --port %PORT% --reload

