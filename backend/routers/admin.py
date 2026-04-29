"""
Admin API Routes
Provides admin-only endpoints for managing and viewing all user data
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Dict
from pydantic import BaseModel

from models.database import get_db
from models.user import User
from models.cart_item import CartItem
from models.product import Product
from routers.auth import get_current_admin_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


class CartItemDetail(BaseModel):
    """Detailed cart item information"""
    cart_item_id: int
    product_id: int
    product_name: str
    quantity: int
    price: float
    subtotal: float
    image_url: str | None = None


class UserCartSummary(BaseModel):
    """Summary of a user's shopping cart"""
    user_id: int
    username: str
    email: str
    cart_items_count: int
    total_value: float
    items: List[CartItemDetail]


class AllCartsResponse(BaseModel):
    """Response containing all users' cart data"""
    total_users_with_carts: int
    total_cart_items: int
    grand_total_value: float
    user_carts: List[UserCartSummary]


@router.get("/carts", response_model=AllCartsResponse)
async def get_all_user_carts(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Get all users' shopping carts (Admin only)
    
    Returns aggregated cart data for all users with items in their cart.
    Requires admin privileges.
    """
    # Get all users who have cart items
    users_with_carts = db.query(User).join(CartItem).distinct().all()
    
    user_carts = []
    total_items = 0
    grand_total = 0.0
    
    for user in users_with_carts:
        # Get cart items for this user with product details
        cart_items = db.query(CartItem).options(
            joinedload(CartItem.product)
        ).filter(
            CartItem.user_id == user.id
        ).all()
        
        items_data = []
        user_total = 0.0
        
        for item in cart_items:
            if item.product:
                item_value = float(item.product.price) * item.quantity
                user_total += item_value
                
                items_data.append(CartItemDetail(
                    cart_item_id=item.id,
                    product_id=item.product.id,
                    product_name=item.product.name,
                    quantity=item.quantity,
                    price=float(item.product.price),
                    subtotal=item_value,
                    image_url=item.product.image_url
                ))
        
        total_items += len(cart_items)
        grand_total += user_total
        
        user_carts.append(UserCartSummary(
            user_id=user.id,
            username=user.username,
            email=user.email,
            cart_items_count=len(cart_items),
            total_value=user_total,
            items=items_data
        ))
    
    return AllCartsResponse(
        total_users_with_carts=len(users_with_carts),
        total_cart_items=total_items,
        grand_total_value=grand_total,
        user_carts=user_carts
    )


@router.get("/users", response_model=List[Dict])
async def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Get list of all registered users (Admin only)
    
    Returns basic user information excluding passwords.
    Requires admin privileges.
    """
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        for user in users
    ]
