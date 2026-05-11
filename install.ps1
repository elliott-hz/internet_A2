# =============================================================================
# Install Script for Internet A2 Project
# =============================================================================
# This script will:
# 1. Check prerequisites (Git, Node.js 18+, Python 3.9+)
# 2. Clean up existing environment
# 3. Install backend dependencies
# 4. Initialize database
# 5. Install frontend dependencies
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Internet A2 Project Installation" -ForegroundColor Cyan
Write-Host "========================================="
Write-Host ""

# Define project root
$PROJECT_ROOT = $PSScriptRoot
Write-Host "Project Root: $PROJECT_ROOT"
Write-Host ""

# =============================================================================
# Step 1: Prerequisites Check
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Checking Prerequisites" -ForegroundColor Cyan
Write-Host "========================================="

# Check Git installation
Write-Host "Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git is installed (version: $gitVersion)" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "Error: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git first: https://git-scm.com/downloads" -ForegroundColor Red
    exit 1
}

# Check Node.js installation (must be 18.x or higher)
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $nodeVersionNum = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
        if ($nodeVersionNum -lt 18) {
            Write-Host "Error: Node.js version is too low (current: $nodeVersion)!" -ForegroundColor Red
            Write-Host "Please upgrade to Node.js 18.x or higher: https://nodejs.org/en/download/" -ForegroundColor Red
            exit 1
        } else {
            Write-Host "Node.js is installed (version: $nodeVersion)" -ForegroundColor Green
        }
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "Error: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18.x or higher: https://nodejs.org/en/download/" -ForegroundColor Red
    exit 1
}

# Check npm installation
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "npm is installed (version: $npmVersion)" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "Error: npm is not installed!" -ForegroundColor Red
    Write-Host "Please reinstall Node.js." -ForegroundColor Red
    exit 1
}

# Check Python installation (must be 3.9 or higher)
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCmd) {
        $pythonVersion = python --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $versionStr = ($pythonVersion -replace 'Python ', '' -split '\.')[0..1] -join '.'
            $versionNum = [int]($versionStr -replace '\.', '')
            if ($versionNum -lt 39) {
                Write-Host "Error: Python version is too low (current: $versionStr)!" -ForegroundColor Red
                Write-Host "Please upgrade to Python 3.9 or higher." -ForegroundColor Red
                exit 1
            } else {
                Write-Host "Python is installed (version: $pythonVersion)" -ForegroundColor Green
            }
        } else {
            throw "Python version check failed"
        }
    } else {
        throw "Python not found"
    }
} catch {
    Write-Host "Error: Python 3 is not installed!" -ForegroundColor Red
    Write-Host "Please install Python 3.9 or higher: https://www.python.org/downloads/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All prerequisites are met!" -ForegroundColor Green
Write-Host ""

# =============================================================================
# Step 2: Cleanup Existing Environment
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Cleaning Up Environment" -ForegroundColor Cyan
Write-Host "========================================="

Set-Location $PROJECT_ROOT

if (Test-Path "cleanup.ps1") {
    Write-Host "Running cleanup script..." -ForegroundColor Yellow
    & ".\cleanup.ps1"
    Write-Host "Cleanup completed" -ForegroundColor Green
} else {
    Write-Host "cleanup.ps1 not found, skipping cleanup" -ForegroundColor Gray
}

Write-Host ""

# =============================================================================
# Step 3: Backend Setup
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Setting Up Backend" -ForegroundColor Cyan
Write-Host "========================================="

Set-Location "$PROJECT_ROOT\backend"

# Create virtual environment
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
python -m venv venv
Write-Host "Virtual environment created" -ForegroundColor Green

# Activate virtual environment and install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
pip install --upgrade pip | Out-Null
pip install -r requirements.txt | Out-Null
Write-Host "Backend dependencies installed" -ForegroundColor Green

Write-Host ""

# =============================================================================
# Step 4: Database Setup
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 4: Setting Up Database" -ForegroundColor Cyan
Write-Host "========================================="

Set-Location "$PROJECT_ROOT\database"

Write-Host "Initializing database..." -ForegroundColor Yellow
python init_db.py
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database initialized successfully" -ForegroundColor Green
} else {
    Write-Host "Warning: Database initialization may have issues" -ForegroundColor Yellow
}

Write-Host ""

# =============================================================================
# Step 5: Frontend Setup
# =============================================================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Step 5: Setting Up Frontend" -ForegroundColor Cyan
Write-Host "========================================="

Set-Location "$PROJECT_ROOT\frontend"

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
Write-Host "Frontend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Installation Completed Successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the project, run:" -ForegroundColor Cyan
Write-Host "  .\restart.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or manually:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend\venv\Scripts && .\activate.ps1 && uvicorn main:app --reload" -ForegroundColor Gray
Write-Host "  Frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""