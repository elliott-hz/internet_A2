"""
FastAPI Backend Application
E-commerce Shopping Cart API
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings

from models.database import engine, Base
from routers import products, cart, auth, admin
from utils.exceptions import NotFoundError, ValidationError, DatabaseError, UnauthorizedError, StockError

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Internet A2 Shopping Cart API",
    description="E-commerce Shopping Cart API for Internet A2 Assignment - Advanced Features",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/cart", tags=["Shopping Cart"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])


# Exception Handlers
@app.exception_handler(NotFoundError)
async def not_found_error_handler(request: Request, exc: NotFoundError):
    """Handle NotFoundError exceptions"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "detail": str(exc),
            "status_code": 404
        }
    )


@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    """Handle ValidationError exceptions"""
    return JSONResponse(
        status_code=400,
        content={
            "error": "Validation Error",
            "detail": str(exc),
            "field": exc.field if hasattr(exc, 'field') and exc.field else None,
            "status_code": 400
        }
    )


@app.exception_handler(DatabaseError)
async def database_error_handler(request: Request, exc: DatabaseError):
    """Handle DatabaseError exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Database Error",
            "detail": str(exc),
            "status_code": 500
        }
    )


@app.exception_handler(UnauthorizedError)
async def unauthorized_error_handler(request: Request, exc: UnauthorizedError):
    """Handle UnauthorizedError exceptions"""
    return JSONResponse(
        status_code=401,
        content={
            "error": "Unauthorized",
            "detail": str(exc),
            "status_code": 401
        }
    )


@app.exception_handler(StockError)
async def stock_error_handler(request: Request, exc: StockError):
    """Handle StockError exceptions"""
    return JSONResponse(
        status_code=400,
        content={
            "error": "Stock Error",
            "detail": str(exc),
            "status_code": 400
        }
    )
