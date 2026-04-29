"""
User Pydantic Schemas
Defines data validation models for user-related API endpoints
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    """Schema for creating a new user (registration)"""
    username: str = Field(..., min_length=3, max_length=50, description="Username must be 3-50 characters")
    email: str = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "password": "securepass123"
            }
        }


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "password": "securepass123"
            }
        }


class UserResponse(BaseModel):
    """Schema for user response (excludes password)"""
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "username": "johndoe",
                "email": "john@example.com",
                "is_admin": False,
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }


class UserUpdate(BaseModel):
    """Schema for updating user information"""
    email: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8, description="New password (min 8 characters)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "newemail@example.com",
                "password": "newsecurepass123"
            }
        }


class TokenResponse(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": 1,
                    "username": "johndoe",
                    "email": "john@example.com",
                    "is_admin": False
                }
            }
        }
