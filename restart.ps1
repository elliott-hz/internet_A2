# =============================================================================
# Restart Script for Internet A2 Project
# =============================================================================
# This script will:
# 1. Stop any existing backend and frontend processes
# 2. Start the backend server (FastAPI/Uvicorn)
# 3. Start the frontend development server (Vite)
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Restarting Internet A2 Services" -ForegroundColor Cyan
Write-Host "========================================="
Write-Host ""

# Define project root
$PROJECT_ROOT = $PSScriptRoot
Write-Host "Project Root: $PROJECT_ROOT"
Write-Host ""

# =============================================================================
# Step 1: Stop Existing Processes
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Stopping Existing Services" -ForegroundColor Cyan
Write-Host "========================================="

# Kill backend process (port 8000)
Write-Host "Checking for backend process on port 8000..." -ForegroundColor Yellow
$process8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process8000) {
    Write-Host "Killing backend process..." -ForegroundColor Yellow
    Stop-Process -Id $process8000 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
    Write-Host "Backend process stopped" -ForegroundColor Green
} else {
    Write-Host "No backend process found on port 8000" -ForegroundColor Gray
}

# Kill frontend process (port 5173)
Write-Host "Checking for frontend process on port 5173..." -ForegroundColor Yellow
$process5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($process5173) {
    Write-Host "Killing frontend process..." -ForegroundColor Yellow
    Stop-Process -Id $process5173 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
    Write-Host "Frontend process stopped" -ForegroundColor Green
} else {
    Write-Host "No frontend process found on port 5173" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# Step 2: Start Backend Server
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Starting Backend Server" -ForegroundColor Cyan
Write-Host "========================================="

# Check if database exists and initialize if needed
$dbPath = Join-Path $PROJECT_ROOT "database\internet_a2.db"
if (-not (Test-Path $dbPath)) {
    Write-Host "Database not found, initializing..." -ForegroundColor Yellow
    Set-Location "$PROJECT_ROOT\database"
    python init_db.py
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database initialized successfully" -ForegroundColor Green
    } else {
        Write-Host "Database initialization failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Database found: internet_a2.db" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Uvicorn server on http://0.0.0.0:8000" -ForegroundColor Yellow
Write-Host "Backend API will be available at: http://localhost:8000/api" -ForegroundColor Yellow
Write-Host ""

# Check if virtual environment exists
$venvPath = Join-Path $PROJECT_ROOT "backend\venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Error: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run .\install.ps1 first." -ForegroundColor Red
    exit 1
}

# Start backend in background
Set-Location "$PROJECT_ROOT\backend"

# Create a temporary script to run uvicorn
$backendScript = @"
Set-Location '$PROJECT_ROOT\backend'
& '.\venv\Scripts\Activate.ps1'
uvicorn main:app --reload --host 0.0.0.0 --port 8000
"@

$backendJob = Start-Job -ScriptBlock {
    param($projectRoot)
    Set-Location $projectRoot
    & ".\venv\Scripts\Activate.ps1"
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
} -ArgumentList $PROJECT_ROOT

Write-Host "Backend started" -ForegroundColor Green

# Wait a moment for backend to start
Start-Sleep -Seconds 3

Write-Host ""

# =============================================================================
# Step 3: Start Frontend Server
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Starting Frontend Server" -ForegroundColor Cyan
Write-Host "========================================="

Set-Location "$PROJECT_ROOT\frontend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Error: Frontend dependencies not installed!" -ForegroundColor Red
    Write-Host "Please run .\install.ps1 first." -ForegroundColor Red
    exit 1
}

Write-Host "Starting Vite development server..." -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Features: Product editing, Admin dashboard, User authentication" -ForegroundColor Yellow
Write-Host ""

# Start frontend in background
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $PSScriptRoot
    npm run dev
}

Write-Host "Frontend started" -ForegroundColor Green

Write-Host ""

# =============================================================================
# Services Started
# =============================================================================
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  All Services Started!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:  http://localhost:8000/api" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop services, run:" -ForegroundColor Yellow
Write-Host "  Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Gray
Write-Host ""
Write-Host "Or press Ctrl+C to stop this script and the services." -ForegroundColor Gray
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Keep script running to show logs
Write-Host "Press Ctrl+C to stop all services..." -ForegroundColor Yellow

# Wait for jobs to complete
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -Force -ErrorAction SilentlyContinue
    Remove-Job -Job $frontendJob -Force -ErrorAction SilentlyContinue
    
    # Kill any remaining processes on ports
    $process8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process8000) { Stop-Process -Id $process8000 -Force -ErrorAction SilentlyContinue }
    
    $process5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process5173) { Stop-Process -Id $process5173 -Force -ErrorAction SilentlyContinue }
    
    Write-Host "Services stopped" -ForegroundColor Green
}