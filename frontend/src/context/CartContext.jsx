import PropTypes from 'prop-types';
import { createContext, useState, useContext, useEffect, useRef } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductsContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { products, refetch: refetchProducts } = useProducts(); // Get products and refetch function
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockError, setStockError] = useState(null); // Stock-specific error state
  const [operationLoading, setOperationLoading] = useState(false); // Global operation loading state
  const minLoadingTimeoutRef = useRef(null); // Ref to track minimum loading timeout

  // Fetch cart items from backend
  const fetchCart = async () => {
    // Only fetch cart if user is authenticated
    if (!isAuthenticated) {
      setCartItems([]);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const response = await cartService.getCartItems();
      setCartItems(response);
      setError(null);
      setStockError(null);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  // Load cart when authentication status changes
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (productOrId, quantity = 1) => {
    setOperationLoading(true);
    
    // Ensure minimum display time of 1.5 seconds
    const minDisplayPromise = new Promise(resolve => {
      minLoadingTimeoutRef.current = setTimeout(resolve, 1500);
    });
    
    try {
      // Support both product object and product ID
      let productId;
      let product = null;
      
      if (typeof productOrId === 'object') {
        // Product object passed - use it for optimistic update
        product = productOrId;
        productId = product.id;
      } else {
        // Product ID passed - need to fetch product details first
        productId = productOrId;
      }

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item) => item.product_id === productId || item.productId === productId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Item exists - update quantity optimistically
        newItems = cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // New item - if we have product object, use it; otherwise just use ID and let backend response update
        if (product) {
          newItems = [
            ...cartItems,
            {
              id: Date.now(), // Temporary ID for optimistic update
              product_id: productId,
              productId: productId,
              product_name: product.name,
              productName: product.name,
              price: product.price,
              quantity: quantity,
              stock_quantity: product.stock_quantity,
              image_url: product.image_url,
            },
          ];
        } else {
          // Don't have product details - will update from backend response
          newItems = [
            ...cartItems,
            {
              product_id: productId,
              productId: productId,
              quantity: quantity,
            },
          ];
        }
      }

      // Optimistically update UI immediately
      setCartItems(newItems);

      // Sync with backend
      const response = await cartService.addToCart(productId, quantity);
      
      // Update temporary ID with real ID from backend response
      // This ensures subsequent operations (update, remove) use the correct ID
      if (response && response.id) {
        const updatedItems = newItems.map(item => {
          // Check if this is a new item with temporary ID
          const isNewItem = !item.id || (typeof item.id === 'number' && item.id > 1000000000000);
          if (isNewItem && (item.product_id === productId || item.productId === productId)) {
            return { ...item, id: response.id };
          }
          return item;
        });
        setCartItems(updatedItems);
      }

      // Refresh products to sync stock quantities after successful add
      await refetchProducts();

      setStockError(null);
    } catch (err) {
      console.error('Failed to add to cart:', err);

      // Refresh cart on error to restore consistency
      await fetchCart();

      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'Failed to add item to cart';
      if (
        errorMessage.toLowerCase().includes('available') ||
        errorMessage.toLowerCase().includes('stock')
      ) {
        setStockError(errorMessage);
        setError(null);
      } else {
        setError(errorMessage);
        setStockError(null);
      }
      throw err;
    } finally {
      // Wait for minimum display time before hiding overlay
      await minDisplayPromise;
      setOperationLoading(false);
      if (minLoadingTimeoutRef.current) {
        clearTimeout(minLoadingTimeoutRef.current);
        minLoadingTimeoutRef.current = null;
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    setOperationLoading(true);
    
    // Ensure minimum display time of 1.5 seconds
    const minDisplayPromise = new Promise(resolve => {
      minLoadingTimeoutRef.current = setTimeout(resolve, 1500);
    });
    
    // Save the original quantity for rollback if needed
    const originalQuantity =
      cartItems.find((item) => item.id === itemId)?.quantity || 0;

    try {
      // Optimistically update the UI first
      const updatedItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);

      // Then sync with backend
      await cartService.updateCartItem(itemId, quantity);
      
      // No need to refetch products for quantity update - stock doesn't change
      // Only add/remove operations affect product stock

      setError(null);
      setStockError(null);
    } catch (err) {
      console.error('Failed to update quantity:', err);

      // Check if it's a stock-related error
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'Failed to update quantity';

      if (
        errorMessage.toLowerCase().includes('available') ||
        errorMessage.toLowerCase().includes('stock')
      ) {
        setStockError(errorMessage);
        setError(null);
        // Revert to the original quantity
        const revertedItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: originalQuantity } : item
        );
        setCartItems(revertedItems);
      } else {
        setError(errorMessage);
        setStockError(null);
        // On non-stock error, refetch to ensure consistency
        await fetchCart();
      }
      throw err;
    } finally {
      // Wait for minimum display time before hiding overlay
      await minDisplayPromise;
      setOperationLoading(false);
      if (minLoadingTimeoutRef.current) {
        clearTimeout(minLoadingTimeoutRef.current);
        minLoadingTimeoutRef.current = null;
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setOperationLoading(true);
    
    // Ensure minimum display time of 1.5 seconds
    const minDisplayPromise = new Promise(resolve => {
      minLoadingTimeoutRef.current = setTimeout(resolve, 1500);
    });
    
    try {
      // Optimistically remove from UI first
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedItems);

      // Then sync with backend
      await cartService.removeCartItem(itemId);
      
      // Refresh products to restore stock quantities after successful removal
      await refetchProducts();

      setError(null);
      setStockError(null);
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item');
      setStockError(null);
      // On error, refetch to ensure consistency
      await fetchCart();
      throw err;
    } finally {
      // Wait for minimum display time before hiding overlay
      await minDisplayPromise;
      setOperationLoading(false);
      if (minLoadingTimeoutRef.current) {
        clearTimeout(minLoadingTimeoutRef.current);
        minLoadingTimeoutRef.current = null;
      }
    }
  };

  // Clear stock error
  const clearStockError = () => {
    setStockError(null);
  };

  // Clear entire cart
  const clearCart = async () => {
    setOperationLoading(true);
    
    // Ensure minimum display time of 1.5 seconds
    const minDisplayPromise = new Promise(resolve => {
      minLoadingTimeoutRef.current = setTimeout(resolve, 1500);
    });
    
    try {
      // Optimistically clear the cart
      setCartItems([]);
      
      // Then sync with backend
      await cartService.clearCart();
      
      // Refresh products to restore all stock quantities after clearing cart
      await refetchProducts();

      setError(null);
      setStockError(null);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
      setStockError(null);
      // On error, refetch to ensure consistency
      await fetchCart();
      throw err;
    } finally {
      // Wait for minimum display time before hiding overlay
      await minDisplayPromise;
      setOperationLoading(false);
      if (minLoadingTimeoutRef.current) {
        clearTimeout(minLoadingTimeoutRef.current);
        minLoadingTimeoutRef.current = null;
      }
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Get total item count
  const getTotalCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    stockError,
    operationLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    clearCart,
    getTotalPrice,
    getTotalCount,
    clearStockError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
