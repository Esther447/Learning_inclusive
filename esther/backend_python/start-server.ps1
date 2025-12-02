# Start the backend server with proper error handling
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Inclusive Learning Platform API" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
# If we're in backend_python, go up one level
if (Test-Path "main.py") {
    Write-Host "⚠️  Warning: You're in backend_python directory" -ForegroundColor Yellow
    Write-Host "Changing to parent directory (esther)..." -ForegroundColor Yellow
    cd ..
}

if (-not (Test-Path "backend_python\main.py")) {
    Write-Host "❌ Error: backend_python\main.py not found!" -ForegroundColor Red
    Write-Host "Please run this script from the esther directory" -ForegroundColor Yellow
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Test imports
Write-Host "`nTesting imports..." -ForegroundColor Cyan
try {
    python -c "import backend_python.main; print('✅ All imports successful')" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Import failed"
    }
    Write-Host "✅ All imports successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Import test failed! Check the error above." -ForegroundColor Red
    Write-Host "Trying to import to see the error:" -ForegroundColor Yellow
    python -c "import backend_python.main"
    exit 1
}

Write-Host "`n🚀 Starting server on http://localhost:8001" -ForegroundColor Green
Write-Host "📚 API docs: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host "🏥 Health check: http://localhost:8001/api/health" -ForegroundColor Cyan
Write-Host "`nPress CTRL+C to stop the server`n" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Start the server
python -m uvicorn backend_python.main:app --host 0.0.0.0 --port 8001 --reload --log-level info


