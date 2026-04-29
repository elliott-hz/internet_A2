"""
Authentication API Routes
Handles user registration, login, logout, and token management
"""

from fastapi import APIRouter, HTTPException, status, Header, Depends
from sqlalchemy.orm import Session
from typing import Optional

from models.database import get_db
from models.user import User
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from services.auth_service import AuthService
from utils.exceptions import ValidationError

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user account
    
    - **username**: Unique username (3-50 characters)
    - **email**: Valid email address
    - **password**: Password (minimum 8 characters)
    
    Returns the created user information (without password)
    """
    try:
        user = AuthService.register_user(db, user_data)
        return user
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    User login
    
    - **username**: Username or email
    - **password**: Password
    
    Returns JWT access token and user information on successful authentication
    """
    # Authenticate user
    user = AuthService.authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Generate JWT token
    access_token = AuthService.create_access_token(
        data={"sub": user.username, "user_id": user.id}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """
    User logout (client-side token removal)
    
    Note: JWT is stateless, so logout is handled client-side by removing the token.
    This endpoint is provided for consistency and future session tracking.
    """
    return {"message": "Logged out successfully. Please remove your token client-side."}


@router.get("/me", response_model=UserResponse)
async def get_current_user_endpoint(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user information
    
    Requires Authorization header with Bearer token
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Extract token
    token = authorization.replace("Bearer ", "")
    
    try:
        # Decode token
        payload = AuthService.decode_token(token)
        username = payload.get("sub")
        
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user from database
        user = AuthService.get_user_by_username(db, username)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


# Dependency injection for protected routes
async def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if authenticated, returns None otherwise
    
    Used for optional authentication (e.g., showing different data based on auth status)
    """
    if not authorization:
        return None
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = AuthService.decode_token(token)
        username = payload.get("sub")
        
        if not username:
            return None
        
        user = AuthService.get_user_by_username(db, username)
        return user
    except Exception:
        return None


async def get_current_user_required(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current user, requires authentication
    
    Used for protected routes that require login
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = AuthService.decode_token(token)
        username = payload.get("sub")
        
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        user = AuthService.get_user_by_username(db, username)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


async def get_current_admin_user(
    current_user: User = Depends(get_current_user_required)
) -> User:
    """
    Get current user and verify admin privileges
    
    Used for admin-only routes
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


async def get_current_admin_required(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency for admin-only routes
    Extracts token, validates user, and checks admin status
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = AuthService.decode_token(token)
        username = payload.get("sub")
        
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        user = AuthService.get_user_by_username(db, username)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        if not user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
        
        return user
        
    except ValidationError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
