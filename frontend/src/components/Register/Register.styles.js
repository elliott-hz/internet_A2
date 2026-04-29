import styled from 'styled-components';

export const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const Input = styled.input`
  padding: 12px 16px;
  font-size: 14px;
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

export const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 14px;
  text-align: center;
`;

export const SubmitButton = styled.button`
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.25);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SwitchText = styled.p`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
`;

export const SwitchLink = styled.span`
  color: #4caf50;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    color: #45a049;
  }
`;
