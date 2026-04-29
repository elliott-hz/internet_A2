"""
Cart Item Database Model
"""

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class CartItem(Base):
    """Shopping cart item model representing products added to user's cart"""
    
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="cart_items")
    product = relationship("Product", back_populates="cart_items")
    
    def __repr__(self):
        return f"<CartItem(id={self.id}, user_id={self.user_id}, product_id={self.product_id}, quantity={self.quantity})>"
    
    def to_dict(self):
        """Convert cart item to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            # Include product details for convenience
            "product_name": self.product.name if self.product else None,
            "price": float(self.product.price) if self.product else None,
            "image_url": self.product.image_url if self.product else None,
        }
