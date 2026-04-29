"""
Cart Service
Business logic for shopping cart operations with user-specific carts
"""

from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from models.cart_item import CartItem
from schemas.cart_item import CartItemCreate, CartItemUpdate
from utils.exceptions import NotFoundError, ValidationError, StockError


class CartService:
    """Service class for cart-related business logic"""
    
    @staticmethod
    def get_user_cart_items(db: Session, user_id: int) -> List[CartItem]:
        """
        Get all items in a specific user's cart
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            List of CartItem objects with product details
        """
        return db.query(CartItem).options(
            joinedload(CartItem.product)
        ).filter(
            CartItem.user_id == user_id
        ).order_by(CartItem.created_at).all()
    
    @staticmethod
    def get_all_items(db: Session) -> List[CartItem]:
        """
        Get all items in the cart (legacy method - use get_user_cart_items instead)
        
        Args:
            db: Database session
            
        Returns:
            List of CartItem objects with product details
        """
        return db.query(CartItem).options(
            joinedload(CartItem.product)
        ).order_by(CartItem.created_at).all()
    
    @staticmethod
    def get_item_by_id(db: Session, item_id: int) -> CartItem:
        """
        Get cart item by ID
        
        Args:
            db: Database session
            item_id: Cart item ID
            
        Returns:
            CartItem object
            
        Raises:
            NotFoundError: If cart item is not found
        """
        cart_item = db.query(CartItem).options(
            joinedload(CartItem.product)
        ).filter(CartItem.id == item_id).first()
        if not cart_item:
            raise NotFoundError("Cart Item")
        return cart_item
    
    @staticmethod
    def get_user_item_by_product(db: Session, user_id: int, product_id: int) -> CartItem:
        """
        Get cart item by user ID and product ID
        
        Args:
            db: Database session
            user_id: User ID
            product_id: Product ID
            
        Returns:
            CartItem object
            
        Raises:
            NotFoundError: If cart item is not found
        """
        cart_item = db.query(CartItem).filter(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id
        ).first()
        if not cart_item:
            raise NotFoundError("Cart Item")
        return cart_item
    
    @staticmethod
    def get_item_by_product(db: Session, product_id: int) -> CartItem:
        """
        Get cart item by product ID (legacy method)
        
        Args:
            db: Database session
            product_id: Product ID
            
        Returns:
            CartItem object
            
        Raises:
            NotFoundError: If cart item is not found
        """
        cart_item = db.query(CartItem).filter(CartItem.product_id == product_id).first()
        if not cart_item:
            raise NotFoundError("Cart Item")
        return cart_item
    
    @staticmethod
    def create_item(
        db: Session, 
        cart_item_data: CartItemCreate,
        user_id: int,
        product_stock_quantity: int,
        product_available: bool
    ) -> CartItem:
        """
        Create a new cart item
        
        Args:
            db: Database session
            cart_item_data: Cart item creation data
            user_id: User ID who owns this cart item
            product_stock_quantity: Product's stock quantity for validation
            product_available: Product's availability status
            
        Returns:
            Created CartItem object
            
        Raises:
            ValidationError: If quantity is invalid
            StockError: If stock is insufficient or product unavailable
        """
        # Validate quantity
        if cart_item_data.quantity <= 0:
            raise ValidationError("Quantity must be greater than zero")
        
        if cart_item_data.quantity > 99:
            raise ValidationError("Maximum quantity per item is 99")
        
        # Check product availability
        if not product_available:
            raise StockError("Product is not available")
        
        # Check stock
        if cart_item_data.quantity > product_stock_quantity:
            raise StockError(f"Only {product_stock_quantity} items available in stock")
        
        # Create cart item with user_id
        cart_item_dict = cart_item_data.model_dump()
        cart_item_dict['user_id'] = user_id
        
        cart_item = CartItem(**cart_item_dict)
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item
    
    @staticmethod
    def update_item(
        db: Session, 
        item_id: int, 
        cart_item_data: CartItemUpdate,
        product_stock_quantity: int,
        product_available: bool
    ) -> CartItem:
        """
        Update an existing cart item
        
        Args:
            db: Database session
            item_id: Cart item ID to update
            cart_item_data: Cart item update data
            product_stock_quantity: Product's stock quantity for validation
            product_available: Product's availability status
            
        Returns:
            Updated CartItem object
            
        Raises:
            NotFoundError: If cart item is not found
            ValidationError: If quantity is invalid
            StockError: If stock is insufficient or product unavailable
        """
        cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
        
        if not cart_item:
            raise NotFoundError("Cart Item")
        
        # Update only provided fields
        update_data = cart_item_data.model_dump(exclude_unset=True)
        
        # Validate quantity if provided
        if 'quantity' in update_data:
            if update_data['quantity'] <= 0:
                raise ValidationError("Quantity must be greater than zero")
            
            if update_data['quantity'] > 99:
                raise ValidationError("Maximum quantity per item is 99")
            
            # Check product availability
            if not product_available:
                raise StockError("Product is no longer available")
            
            # Check stock
            if update_data['quantity'] > product_stock_quantity:
                raise StockError(f"Only {product_stock_quantity} items available in stock")
        
        for field, value in update_data.items():
            setattr(cart_item, field, value)
        
        db.commit()
        db.refresh(cart_item)
        return cart_item
    
    @staticmethod
    def remove_item(db: Session, item_id: int) -> bool:
        """
        Remove an item from the cart
        
        Args:
            db: Database session
            item_id: Cart item ID to remove
            
        Returns:
            True if removed
            
        Raises:
            NotFoundError: If cart item is not found
        """
        cart_item = db.query(CartItem).filter(CartItem.id == item_id).first()
        
        if not cart_item:
            raise NotFoundError("Cart Item")
        
        db.delete(cart_item)
        db.commit()
        return True
    
    @staticmethod
    def clear_user_cart(db: Session, user_id: int) -> None:
        """
        Clear all items from a specific user's cart
        
        Args:
            db: Database session
            user_id: User ID
        """
        db.query(CartItem).filter(CartItem.user_id == user_id).delete()
        db.commit()
    
    @staticmethod
    def clear_cart(db: Session) -> None:
        """
        Clear all items from the cart (legacy method)
        
        Args:
            db: Database session
        """
        db.query(CartItem).delete()
        db.commit()
