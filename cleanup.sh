#!/bin/bash

# Project Cleanup Script for Internet_A1 E-commerce Shopping Cart
# OS: Linux/MacOS
# Usage: chmod +x cleanup.sh && ./cleanup.sh
# Location: internet_A1 root directory


# Define project root directory (relative path: script location = internet_A1 root directory)
PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DATABASE_DIR="$PROJECT_ROOT/database"

echo "Starting project cleanup..."
echo "Project root directory: $PROJECT_ROOT"

# Step 1: Stop all related processes
echo -e "\nStopping processes using ports 8000/5173..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
echo "Port processes cleaned up"

# Step 2: Clean up backend environment
echo -e "\nCleaning up backend Python environment..."
# Deactivate virtual environment (if active)
deactivate 2>/dev/null

# Delete virtual environment
if [ -d "$BACKEND_DIR/venv" ]; then
    rm -rf "$BACKEND_DIR/venv"
    echo "Backend virtual environment venv has been deleted"
else
    echo "Backend virtual environment venv does not exist, skipping"
fi

# Delete __pycache__ cache
find "$BACKEND_DIR" -type d -name "__pycache__" -exec rm -rf {} +
echo "Backend __pycache__ cache has been deleted"

# Delete SQLite database file
DB_FILES=(
    "$BACKEND_DIR/database/internet_a2.db"
    "$DATABASE_DIR/internet_a2.db"
    "$BACKEND_DIR/database/internet_a1.db"
    "$DATABASE_DIR/internet_a1.db"
)
for db_file in "${DB_FILES[@]}"; do
    if [ -f "$db_file" ]; then
        rm -f "$db_file"
        echo "Database file $db_file has been deleted"
    fi
done

# Delete backend cache files
rm -rf "$BACKEND_DIR/.pytest_cache" "$BACKEND_DIR/.mypy_cache" 2>/dev/null
echo "Backend cache files have been cleaned up"

# Step 3: Clean up frontend environment
echo -e "\nCleaning up frontend Node.js environment..."
# Delete node_modules and lock files
if [ -d "$FRONTEND_DIR/node_modules" ]; then
    rm -rf "$FRONTEND_DIR/node_modules"
    echo "Frontend node_modules has been deleted"
else
    echo "Frontend node_modules does not exist, skipping"
fi

# Delete lock files
rm -f "$FRONTEND_DIR/package-lock.json" "$FRONTEND_DIR/yarn.lock" "$FRONTEND_DIR/pnpm-lock.yaml" 2>/dev/null
echo "Frontend dependency lock files have been deleted"

# Delete build artifacts and cache
rm -rf "$FRONTEND_DIR/dist" "$FRONTEND_DIR/.vite" "$FRONTEND_DIR/.eslintcache" "$FRONTEND_DIR/.prettiercache" 2>/dev/null
echo "Frontend build artifacts and cache have been cleaned up"

# Step 4: Global cleanup
echo -e "\nGlobal residual file cleanup..."
# Delete log files
find "$PROJECT_ROOT" -name "*.log" -delete 2>/dev/null
# Delete environment variable files
rm -f "$PROJECT_ROOT/.env" "$PROJECT_ROOT/.env.local" "$PROJECT_ROOT/.env.development" 2>/dev/null
echo "Global residual files have been cleaned up"

# Verify cleanup results
echo -e "\nCleanup Results:"
[ ! -d "$BACKEND_DIR/venv" ] && echo "Backend virtual environment: Deleted" || echo "Backend virtual environment: Not deleted"
[ ! -d "$FRONTEND_DIR/node_modules" ] && echo "Frontend dependencies: Deleted" || echo "Frontend dependencies: Not deleted"
[ ! -f "$BACKEND_DIR/database/internet_a1.db" ] && echo "Database file: Deleted" || echo "Database file: Not deleted"

echo -e "\nCleanup completed! You can now re-run the installation steps in the README to test the environment."