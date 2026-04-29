"""
Product Service
Business logic for product-related operations including search and admin management
"""

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import logging

from models.product import Product
from models.cart_item import CartItem
from schemas.product import ProductCreate, ProductUpdate
from utils.exceptions import NotFoundError, ValidationError


class ProductService:
    """Service class for product-related business logic"""
    
    @staticmethod
    def get_all_products(db: Session) -> List[Product]:
        """
        Get all available products
        
        Args:
            db: Database session
            
        Returns:
            List of Product objects
        """
        return db.query(Product).filter(Product.is_available == True).all()
    
    @staticmethod
    def get_product_by_id(db: Session, product_id: int) -> Product:
        """
        Get product by ID
        
        Args:
            db: Database session
            product_id: Product ID
            
        Returns:
            Product object
            
        Raises:
            NotFoundError: If product is not found
        """
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise NotFoundError("Product")
        return product
    
    @staticmethod
    def search_products(db: Session, query: str) -> List[Product]:
        """
        Search products by name or description (case-insensitive)
        
        Args:
            db: Database session
            query: Search term
            
        Returns:
            List of matching Product objects
        """
        search_term = f"%{query}%"
        return db.query(Product).filter(
            (Product.name.ilike(search_term)) | 
            (Product.description.ilike(search_term)),
            Product.is_available == True
        ).all()
    
    @staticmethod
    def create_product(db: Session, product_data: ProductCreate) -> Product:
        """
        Create a new product
        
        Args:
            db: Database session
            product_data: Product creation data
            
        Returns:
            Created Product object
        """
        db_product = Product(**product_data.model_dump())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    
    @staticmethod
    def get_product_cart_quantity(db: Session, product_id: int) -> int:
        """
        Get total quantity of a product across all user carts
        
        Args:
            db: Database session
            product_id: Product ID
            
        Returns:
            Total quantity in all carts
        """
        result = db.query(func.sum(CartItem.quantity)).filter(
            CartItem.product_id == product_id
        ).scalar()
        
        return result or 0
    
    @staticmethod
    def update_product(db: Session, product_id: int, product_data: ProductUpdate, is_admin: bool = True) -> Product:
        """
        Update an existing product (admin only)
        
        Args:
            db: Database session
            product_id: Product ID to update
            product_data: Product update data
            is_admin: Whether the user is an admin (for stock validation)
            
        Returns:
            Updated Product object
            
        Raises:
            NotFoundError: If product is not found
            ValidationError: If stock validation fails
        """
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            raise NotFoundError("Product")
        
        # Get update data
        update_data = product_data.model_dump(exclude_unset=True)
        
        # Validate stock quantity if being updated
        if 'stock_quantity' in update_data:
            new_stock = update_data['stock_quantity']
            
            # Get total quantity in all carts
            cart_quantity = ProductService.get_product_cart_quantity(db, product_id)
            
            # Validate: stock cannot be less than quantity in carts
            if new_stock < cart_quantity:
                raise ValidationError(
                    f"Cannot reduce stock below {cart_quantity}. "
                    f"{cart_quantity} item(s) are currently in users' carts."
                )
        
        # Update product fields
        for field, value in update_data.items():
            setattr(product, field, value)
        
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(db: Session, product_id: int) -> bool:
        """
        Delete a product (admin only)
        
        Args:
            db: Database session
            product_id: Product ID to delete
            
        Returns:
            True if deleted
            
        Raises:
            NotFoundError: If product is not found
            ValidationError: If product is in active carts
        """
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            raise NotFoundError("Product")
        
        # Check if product is in any active cart
        cart_quantity = ProductService.get_product_cart_quantity(db, product_id)
        if cart_quantity > 0:
            raise ValidationError(
                f"Cannot delete product. {cart_quantity} item(s) are in users' carts."
            )
        
        db.delete(product)
        db.commit()
        return True
