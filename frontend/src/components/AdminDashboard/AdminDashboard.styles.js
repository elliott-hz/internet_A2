import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f5f5;

  h2 {
    margin: 0 0 12px 0;
    font-size: 22px;
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
  gap: 16px;
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
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  h3 {
    margin: 0;
    font-size: 16px;
    white-space: nowrap;
  }

  span {
    font-size: 13px;
    opacity: 0.9;
    white-space: nowrap;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

export const CartSummary = styled.div`
  font-size: 13px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 4px;
  white-space: nowrap;
`;

export const ItemsList = styled.div`
  padding: 12px;
  background: #fafafa;
`;

export const CartItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }
`;

export const ItemDetails = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(150px, 2fr) 100px 120px 150px;
  gap: 12px;
  align-items: center;
  min-width: 0;

  .name {
    font-weight: 600;
    color: #333;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .quantity,
  .price {
    font-size: 13px;
    color: #666;
    white-space: nowrap;
  }

  .subtotal {
    font-weight: 600;
    color: #4caf50;
    font-size: 13px;
    white-space: nowrap;
    justify-self: end;
  }

  .separator {
    display: none;
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
