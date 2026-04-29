import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f5f5;

  h2 {
    margin: 0 0 16px 0;
    font-size: 24px;
    color: #333;
  }
`;

export const Stats = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  div {
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
    color: #555;
    font-weight: 500;
  }
`;

export const UserCartsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const UserCartCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const UserHeader = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
  }

  span {
    font-size: 14px;
    opacity: 0.9;
  }
`;

export const CartSummary = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-block;
`;

export const ItemsList = styled.div`
  padding: 16px;
  background: #fafafa;
`;

export const CartItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

export const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name {
    font-weight: 600;
    color: #333;
    font-size: 15px;
  }

  .quantity,
  .price,
  .subtotal {
    font-size: 13px;
    color: #666;
  }

  .subtotal {
    font-weight: 600;
    color: #4caf50;
    margin-top: 4px;
  }
`;

export const AccessDenied = styled.div`
  padding: 40px;
  text-align: center;
  color: #c62828;
  font-size: 18px;
  font-weight: 600;
`;

export const Loading = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

export const Error = styled.div`
  padding: 20px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  text-align: center;
`;

export const Empty = styled.div`
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 16px;
`;
