import styled from 'styled-components';

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 24px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.12);
  }

  &::placeholder {
    color: #999;
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;
