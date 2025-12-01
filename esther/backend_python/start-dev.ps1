# Simple dev startup script for backend
# - sets DISABLE_SQL=True in the environment for the local PowerShell session
# - activates venv
# - starts UVicorn on port 8001 with reload

$env:DISABLE_SQL = "True"
Write-Host "Starting backend in dev mode with DISABLE_SQL=$($env:DISABLE_SQL)"
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload --log-level debug
