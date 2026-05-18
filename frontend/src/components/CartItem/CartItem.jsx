import PropTypes from 'prop-types';
import { useState, memo } from 'react';
import { useCartOperations } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import ConfirmationModal from '../Modal/Modal';
import * as S from './CartItem.styles';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartOperations();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get stock quantity from item (from backend response)
  // stock_quantity represents available stock (already deducted cart quantities)
  const stockQuantity = item.stock_quantity || 0;
  
  // Disable plus button only when no stock available
  const isMaxStock = stockQuantity <= 0;

  // Calculate item total (quantity * price)
  const itemTotal = (item.price || 0) * item.quantity;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Error could be shown to user via toast/notification
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(item.id);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Error could be shown to user via toast/notification
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <S.ItemContainer>
      <S.ItemInfo>
        <S.ItemName>{item.product_name || item.productName}</S.ItemName>
        <S.ItemTotal>{formatCurrency(itemTotal)}</S.ItemTotal>
      </S.ItemInfo>

      <S.ItemDetails>
        <S.UnitPrice>
          {formatCurrency(item.price || 0)} × {item.quantity}
        </S.UnitPrice>

        <S.Controls>
          <S.QuantityControl>
            <S.QuantityButton
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
            >
              −
            </S.QuantityButton>

            <S.QuantityDisplay>{item.quantity}</S.QuantityDisplay>

            <S.QuantityButton
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || isMaxStock}
            >
              +
            </S.QuantityButton>
          </S.QuantityControl>

          <S.RemoveButton
            onClick={() => setShowConfirm(true)}
            disabled={isUpdating}
          >
            Remove
          </S.RemoveButton>
        </S.Controls>
      </S.ItemDetails>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Remove Item"
        message="Remove this item from cart?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleRemove}
        onCancel={() => setShowConfirm(false)}
        type="danger"
      />
    </S.ItemContainer>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    product_name: PropTypes.string,
    productName: PropTypes.string,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    stock_quantity: PropTypes.number,
  }).isRequired,
};

export default memo(CartItem);
