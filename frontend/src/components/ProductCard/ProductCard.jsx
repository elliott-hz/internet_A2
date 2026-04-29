import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartOperations } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatNumber, truncateText } from '../../utils/formatters';
import { validateQuantityInput, parseQuantityValue, checkStockStatus } from '../../utils/validators';
import Toast from '../Modal/Toast';
import * as S from './ProductCard.styles';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart, getQuantityInCart, clearStockError } =
    useCartOperations();
  const { isAuthenticated, isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const [quantityError, setQuantityError] = useState(null);
  const [loginRequiredError, setLoginRequiredError] = useState(null);

  // Calculate available stock using useMemo to ensure it updates when cartItems changes
  const { cartQuantity, availableStock } = useMemo(() => {
    const qtyInCart = getQuantityInCart(product.id);
    return {
      cartQuantity: qtyInCart,
      availableStock: product.stock_quantity - qtyInCart
    };
  }, [product.id, product.stock_quantity, getQuantityInCart]);

  const handleEditProduct = () => {
    navigate(`/product/${product.id}/edit`);
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setLoginRequiredError('Please login first to add items to cart');
      setTimeout(() => {
        setLoginRequiredError(null);
      }, 3000);
      return;
    }

    // Use available stock as the maximum limit
    const maxAllowed = availableStock;
    
    // Validate quantity before making request
    const validation = validateQuantityInput(quantity, { min: 1, max: maxAllowed });
    
    if (!validation.isValid) {
      // Auto-fill with 1 first
      setQuantity(1);
      
      // Then show error message
      setQuantityError(validation.message);
      
      // Auto-clear error after 2 seconds
      setTimeout(() => {
        setQuantityError(null);
      }, 2000);
      
      return;
    }

    setIsAdding(true);
    setAddError(null);
    try {
      await addToCart(product, quantity);
      clearStockError(); // Clear any previous stock errors on success
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Extract the error message
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'Failed to add to cart';
      setAddError(errorMessage);

      // Auto-clear the error after 5 seconds
      setTimeout(() => {
        setAddError(null);
      }, 5000);
    } finally {
      setIsAdding(false);
    }
  };

  const inCart = isInCart(product.id);

  // Use checkStockStatus for stock information
  const stockStatus = checkStockStatus(availableStock, 5);

  const handleQuantityChange = (e) => {
    if (inCart) return;
    
    const value = e.target.value;
    
    // Use available stock as maximum limit
    const maxAllowed = availableStock;
    
    // Use parseQuantityValue to handle the input safely with dynamic max
    const { parsed, isValid } = parseQuantityValue(value, { min: 1, max: maxAllowed });
    
    if (isValid && parsed !== '') {
      setQuantity(parsed);
    } else if (value === '') {
      // Allow empty string for better UX
      setQuantity('');
    }
  };

  // Admin users see "Edit" button instead of "Add to Cart"
  const renderActionButton = () => {
    if (isAdmin && isAuthenticated) {
      return (
        <S.EditButton onClick={handleEditProduct}>
          Edit Product
        </S.EditButton>
      );
    }

    return (
      <S.AddToCartButton
        onClick={handleAddToCart}
        disabled={isAdding || inCart || availableStock <= 0}
        $inCart={inCart}
      >
        {isAdding
          ? 'Adding...'
          : availableStock <= 0
            ? 'Out of Stock'
            : inCart
              ? `In Cart (${cartQuantity})`
              : 'Add to Cart'}
      </S.AddToCartButton>
    );
  };

  return (
    <S.Card>
      <S.ProductImage
        src={product.image_url || '/placeholder-product.jpg'}
        alt={product.name}
      />
      <S.ProductInfo>
        <S.ProductName>{truncateText(product.name, 30)}</S.ProductName>
        <S.ProductDescription>{truncateText(product.description, 80)}</S.ProductDescription>
        <S.ProductPrice>{formatCurrency(product.price)}</S.ProductPrice>

        {/* Stock Information */}
        <S.StockInfo $lowStock={stockStatus.warning}>
          {stockStatus.icon} {stockStatus.label}
          {stockStatus.warning && (
            <S.LowStockWarning> Low stock</S.LowStockWarning>
          )}
        </S.StockInfo>

        {/* Always show quantity input for consistency */}
        <S.QuantityWrapper>
          <S.QuantityLabel>Qty:</S.QuantityLabel>
          <S.InputErrorWrapper>
            <S.QuantityInput
              type="number"
              min="1"
              max={availableStock}
              value={inCart ? cartQuantity : quantity}
              onChange={handleQuantityChange}
              disabled={availableStock <= 0 || inCart}
              readOnly={inCart}
              style={{ borderColor: quantityError ? '#dc3545' : '#ddd' }}
            />
          </S.InputErrorWrapper>
        </S.QuantityWrapper>

        {/* Action button: Edit for admin, Add to Cart for regular users */}
        {renderActionButton()}
      </S.ProductInfo>

      {/* Login Required Error Toast */}
      {loginRequiredError && (
        <Toast
          message={loginRequiredError}
          type="warning"
          duration={3000}
          onClose={() => setLoginRequiredError(null)}
        />
      )}

      {/* Add Error Toast */}
      {addError && (
        <Toast
          message={addError}
          type="error"
          duration={5000}
          onClose={() => setAddError(null)}
        />
      )}

      {/* Quantity Error Toast */}
      {quantityError && (
        <Toast
          message={quantityError}
          type="warning"
          duration={2000}
          onClose={() => setQuantityError(null)}
        />
      )}
    </S.Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    image_url: PropTypes.string,
    stock_quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
