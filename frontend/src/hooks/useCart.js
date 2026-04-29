import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

/**
 * Custom hook for cart operations
 * Provides convenient access to cart context and product data
 */
export const useCartOperations = () => {
  const {
    cartItems,
    loading: cartLoading,
    error: cartError,
    stockError,
    clearStockError,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    clearCart,
    getTotalPrice,
    getTotalCount,
  } = useCart();

  const {
    products,
    displayedProducts,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

  // Check if product is already in cart
  const isInCart = (productId) => {
    return cartItems.some(
      (item) => item.product_id === productId || item.productId === productId
    );
  };

  // Get quantity of product in cart
  const getQuantityInCart = (productId) => {
    const item = cartItems.find(
      (item) => item.product_id === productId || item.productId === productId
    );
    return item ? item.quantity : 0;
  };

  return {
    products,
    displayedProducts,
    cartItems,
    loading: productsLoading || cartLoading,
    error: productsError || cartError,
    stockError,
    clearStockError,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    clearCart,
    refetchProducts,
    getTotalPrice,
    getTotalCount,
    isInCart,
    getQuantityInCart,
  };
};
