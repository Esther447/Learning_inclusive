# PowerShell script to run the backend server
# Make sure you're in the esther directory when running this

Write-Host "🚀 Starting Inclusive Learning Platform Backend..." -ForegroundColor Green

# Check if we're in the right directory
$currentDir = Get-Location
if ($currentDir.Path -notlike "*esther*") {
    Write-Host "⚠️  Warning: Make sure you're in the esther directory" -ForegroundColor Yellow
    Write-Host "   Current directory: $currentDir" -ForegroundColor Yellow
}

# Get port from environment variable or use default
$port = if ($env:PORT) { $env:PORT } else { "8001" }

# Run the server
Write-Host "`n📡 Starting server on http://localhost:$port" -ForegroundColor Cyan
Write-Host "📚 API Documentation: http://localhost:$port/docs" -ForegroundColor Cyan
Write-Host "🔍 ReDoc: http://localhost:$port/redoc" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

uvicorn backend_python.main:app --host 0.0.0.0 --port $port --reload

