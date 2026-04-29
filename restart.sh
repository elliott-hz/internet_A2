#!/bin/bash

# =============================================================================
# Restart Script for Internet A2 Project
# =============================================================================
# This script will:
# 1. Stop any existing backend and frontend processes
# 2. Start the backend server (FastAPI/Uvicorn)
# 3. Start the frontend development server (Vite)
# =============================================================================

set -e  # Exit on error

echo "========================================="
echo "  Restarting Internet A2 Services"
echo "========================================="
echo ""

# Define project root
PROJECT_ROOT=$(git rev-parse --show-toplevel)
echo "Project Root: $PROJECT_ROOT"
echo ""

# =============================================================================
# Step 1: Stop Existing Processes
# =============================================================================
echo "========================================="
echo "  Step 1: Stopping Existing Services"
echo "========================================="

# Kill backend process (port 8000)
echo "Checking for backend process on port 8000..."
if lsof -ti:8000; then
    echo "Killing backend process..."
    kill -9 $(lsof -ti:8000) || true
    echo "✅ Backend process stopped"
else
    echo "ℹ️  No backend process found on port 8000"
fi

# Kill frontend process (port 5173)
echo "Checking for frontend process on port 5173..."
if lsof -ti:5173; then
    echo "Killing frontend process..."
    kill -9 $(lsof -ti:5173) || true
    echo "✅ Frontend process stopped"
else
    echo "ℹ️  No frontend process found on port 5173"
fi

echo ""

# =============================================================================
# Step 2: Start Backend Server
# =============================================================================
echo "========================================="
echo "  Step 2: Starting Backend Server"
echo "========================================="

# Check if database exists and initialize if needed
if [ ! -f "$PROJECT_ROOT/database/internet_a2.db" ]; then
    echo "⚠️  Database not found, initializing..."
    cd "$PROJECT_ROOT/database"
    python3 init_db.py
    if [ $? -eq 0 ]; then
        echo "✅ Database initialized successfully"
    else
        echo "❌ Database initialization failed!"
        exit 1
    fi
    cd "$PROJECT_ROOT/backend"
else
    echo "✅ Database found: internet_a2.db"
fi

echo ""
echo "Starting Uvicorn server on http://0.0.0.0:8000"
echo "Backend API will be available at: http://localhost:8000/api"
echo ""

# Activate virtual environment
cd "$PROJECT_ROOT/backend"
if [ ! -d "venv" ]; then
    echo "❌ Error: Virtual environment not found!"
    echo "   Please run ./install.sh first."
    exit 1
fi

source venv/bin/activate

# Start backend in background
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

echo ""

# =============================================================================
# Step 3: Start Frontend Server
# =============================================================================
echo "========================================="
echo "  Step 3: Starting Frontend Server"
echo "========================================="

cd "$PROJECT_ROOT/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Error: Frontend dependencies not installed!"
    echo "   Please run ./install.sh first."
    exit 1
fi

echo "Starting Vite development server..."
echo "Frontend will be available at: http://localhost:5173"
echo "Features: Product editing, Admin dashboard, User authentication"
echo ""

# Start frontend in background
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started with PID: $FRONTEND_PID"

echo ""

# =============================================================================
# Services Started
# =============================================================================
echo "========================================="
echo "  ✅ All Services Started!"
echo "========================================="
echo ""
echo "Backend API:  http://localhost:8000/api"
echo "Frontend App: http://localhost:5173"
echo ""
echo "Service PIDs:"
echo "  Backend:  $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "To stop services:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or run this script again to restart."
echo "========================================="

# Keep script running to show logs
wait