# Project Cleanup Script for Internet_A2 E-commerce Shopping Cart
# OS: Windows PowerShell
# Usage: .\cleanup.ps1
# Location: internet_A2 root directory

# Define project root directory (script location = internet_A2 root directory)
$PROJECT_ROOT = $PSScriptRoot
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"
$DATABASE_DIR = Join-Path $PROJECT_ROOT "database"

Write-Host "Starting project cleanup..." -ForegroundColor Green
Write-Host "Project root directory: $PROJECT_ROOT"

# Step 1: Stop all related processes
Write-Host "`nStopping processes using ports 8000/5173..." -ForegroundColor Yellow

# Find and kill processes using port 8000
$process8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process8000) {
    Stop-Process -Id $process8000 -Force -ErrorAction SilentlyContinue
    Write-Host "Port 8000 process cleaned up" -ForegroundColor Green
}

# Find and kill processes using port 5173
$process5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process5173) {
    Stop-Process -Id $process5173 -Force -ErrorAction SilentlyContinue
    Write-Host "Port 5173 process cleaned up" -ForegroundColor Green
}

# Step 2: Clean up backend environment
Write-Host "`nCleaning up backend Python environment..." -ForegroundColor Yellow

# Delete virtual environment
$venvPath = Join-Path $BACKEND_DIR "venv"
if (Test-Path $venvPath) {
    Remove-Item -Path $venvPath -Recurse -Force
    Write-Host "Backend virtual environment venv has been deleted" -ForegroundColor Green
} else {
    Write-Host "Backend virtual environment venv does not exist, skipping" -ForegroundColor Gray
}

# Delete __pycache__ cache
Get-ChildItem -Path $BACKEND_DIR -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force
}
Write-Host "Backend __pycache__ cache has been deleted" -ForegroundColor Green

# Delete .pyc files
Get-ChildItem -Path $BACKEND_DIR -Recurse -Filter "*.pyc" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
}

# Step 3: Delete SQLite database files
Write-Host "`nDeleting SQLite database files..." -ForegroundColor Yellow

$DB_FILES = @(
    (Join-Path $BACKEND_DIR "database\internet_a2.db"),
    (Join-Path $DATABASE_DIR "internet_a2.db"),
    (Join-Path $BACKEND_DIR "database\internet_a1.db"),
    (Join-Path $DATABASE_DIR "internet_a1.db")
)

foreach ($db_file in $DB_FILES) {
    if (Test-Path $db_file) {
        Remove-Item $db_file -Force
        Write-Host "Deleted: $db_file" -ForegroundColor Green
    }
}

# Step 4: Clean up frontend environment
Write-Host "`nCleaning up frontend environment..." -ForegroundColor Yellow

# Delete node_modules
$nodeModulesPath = Join-Path $FRONTEND_DIR "node_modules"
if (Test-Path $nodeModulesPath) {
    Remove-Item -Path $nodeModulesPath -Recurse -Force
    Write-Host "Frontend node_modules has been deleted" -ForegroundColor Green
} else {
    Write-Host "Frontend node_modules does not exist, skipping" -ForegroundColor Gray
}

# Delete dist folder
$distPath = Join-Path $FRONTEND_DIR "dist"
if (Test-Path $distPath) {
    Remove-Item -Path $distPath -Recurse -Force
    Write-Host "Frontend dist folder has been deleted" -ForegroundColor Green
} else {
    Write-Host "Frontend dist folder does not exist, skipping" -ForegroundColor Gray
}

# Delete .vite cache
$viteCachePath = Join-Path $FRONTEND_DIR ".vite"
if (Test-Path $viteCachePath) {
    Remove-Item -Path $viteCachePath -Recurse -Force
    Write-Host "Frontend .vite cache has been deleted" -ForegroundColor Green
} else {
    Write-Host "Frontend .vite cache does not exist, skipping" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Project cleanup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green