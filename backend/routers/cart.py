"""
Shopping Cart API Routes
Handles all cart-related CRUD operations with user-specific carts
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models.database import get_db
from models.product import Product
from models.user import User
from schemas.cart_item import CartItemCreate, CartItemUpdate, CartItemResponse
from services.cart_service import CartService
from utils.exceptions import NotFoundError, ValidationError, StockError
from routers.auth import get_current_user_required

router = APIRouter()


def _populate_cart_item_response(item) -> dict:
    """Helper function to populate cart item response with product data"""
    return {
        "id": item.id,
        "user_id": item.user_id,
        "product_id": item.product_id,
        "quantity": item.quantity,
        "created_at": item.created_at,
        "updated_at": item.updated_at,
        "product_name": item.product.name if item.product else None,
        "price": float(item.product.price) if item.product and item.product.price else None,
        "image_url": item.product.image_url if item.product else None,
        "stock_quantity": item.product.stock_quantity if item.product else None
    }


@router.get("")
async def get_cart_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Get all items in the current user's shopping cart
    
    Returns a list of all cart items for the authenticated user.
    Requires authentication.
    """
    items = CartService.get_user_cart_items(db, current_user.id)
    
    # Manually populate the response with product data
    result = []
    for item in items:
        result.append(_populate_cart_item_response(item))
    
    return result


@router.post("/items", response_model=CartItemResponse, status_code=201)
async def add_to_cart(
    cart_item_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Add an item to the current user's shopping cart
    
    - **product_id**: ID of the product to add (required)
    - **quantity**: Quantity to add (1-99, required)
    
    If the product already exists in cart, quantity will be updated.
    Requires authentication.
    """
    # Check if product exists and get stock info
    product = db.query(Product).filter(Product.id == cart_item_data.product_id).first()
    if not product:
        raise NotFoundError("Product")
    
    # Try to get existing cart item for this user and product
    try:
        existing_item = CartService.get_user_item_by_product(db, current_user.id, cart_item_data.product_id)
        
        # Item exists, update quantity
        new_quantity = existing_item.quantity + cart_item_data.quantity
        
        # Create CartItemUpdate object for the service method
        updated_item = CartService.update_item(
            db, 
            existing_item.id, 
            CartItemUpdate(quantity=new_quantity),
            product.stock_quantity,
            product.is_available
        )
        # Manually populate response with product data
        return _populate_cart_item_response(updated_item)
    except NotFoundError:
        # Item doesn't exist in cart, create new one
        new_item = CartService.create_item(
            db, 
            cart_item_data,
            current_user.id,  # Pass user_id
            product.stock_quantity,
            product.is_available
        )
        # Manually populate response with product data
        return _populate_cart_item_response(new_item)


@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    cart_item_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Update the quantity of a cart item
    
    - **item_id**: ID of the cart item to update (required)
    - **quantity**: New quantity (1-99, required)
    
    Verifies that the cart item belongs to the current user.
    Requires authentication.
    """
    # Get cart item and verify ownership
    cart_item = CartService.get_item_by_id(db, item_id)
    
    if cart_item.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only modify your own cart items"
        )
    
    product = cart_item.product
    
    updated_item = CartService.update_item(
        db, 
        item_id, 
        cart_item_data,
        product.stock_quantity,
        product.is_available
    )
    # Manually populate response with product data
    return _populate_cart_item_response(updated_item)


@router.delete("/items/{item_id}", status_code=204)
async def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Remove an item from the current user's shopping cart
    
    - **item_id**: ID of the cart item to remove (required)
    
    Verifies that the cart item belongs to the current user.
    Requires authentication.
    """
    # Verify ownership before deletion
    cart_item = CartService.get_item_by_id(db, item_id)
    
    if cart_item.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only remove your own cart items"
        )
    
    CartService.remove_item(db, item_id)
    return None


@router.delete("", status_code=204)
async def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required)
):
    """
    Clear all items from the current user's shopping cart
    
    This removes all cart items for the authenticated user.
    Requires authentication.
    """
    CartService.clear_user_cart(db, current_user.id)
    return None
