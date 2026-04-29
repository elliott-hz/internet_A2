import styled from 'styled-components';

export const Card = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f5f5f5;
`;

export const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 320px;
`;

export const ProductName = styled.h3`
  font-size: 18px;
  margin: 0;
  color: #333;
  font-weight: 600;
  min-height: 48px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProductDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
`;

export const ProductPrice = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #2e7d32;
  min-height: 28px;
`;

export const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  background-color: ${(props) => (props.$lowStock ? '#fff3cd' : '#e8f5e9')};
  color: ${(props) => (props.$lowStock ? '#856404' : '#2e7d32')};
  border: 1px solid ${(props) => (props.$lowStock ? '#ffc107' : '#c8e6c9')};
  min-height: 40px;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1.4;
`;

export const StockLabel = styled.span`
  font-weight: 500;
`;

export const StockCount = styled.span`
  font-weight: 600;
`;

export const LowStockWarning = styled.span`
  font-size: 12px;
  font-style: italic;
  flex-shrink: 0;
`;

export const OutOfStock = styled.span`
  font-weight: 600;
  color: #d32f2f;
`;

export const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
`;

export const QuantityLabel = styled.label`
  font-size: 14px;
  color: #666;
`;

export const QuantityInput = styled.input`
  width: 60px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const AddToCartButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${(props) => (props.$inCart ? '#bdbdbd' : '#1976d2')};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.$inCart ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;
  min-height: 44px;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$inCart ? '#bdbdbd' : '#1565c0')};
  }

  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

export const EditButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 44px;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CartIndicator = styled.div`
  padding: 12px;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AddErrorAlert = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 13px;
  color: #856404;
  line-height: 1.4;
  animation: shake 0.5s ease-in-out;

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(5px);
    }
  }
`;

// Floating tooltip for quantity validation errors
export const QuantityErrorTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #dc3545;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  margin-bottom: 8px;
  animation: fadeIn 0.2s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #dc3545 transparent transparent transparent;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

export const InputErrorWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
