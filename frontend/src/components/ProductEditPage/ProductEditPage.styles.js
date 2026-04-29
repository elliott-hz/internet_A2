import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f5f5f5;

  h2 {
    margin: 16px 0 0 0;
    font-size: 28px;
    color: #333;
  }
`;

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.3s;

  &:hover {
    color: #4caf50;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const Input = styled.input`
  padding: 12px 16px;
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

  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333;
  transition: all 0.3s ease;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.12);
  }

  &::placeholder {
    color: #999;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #333;
  cursor: pointer;

  span {
    font-weight: 500;
  }
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4caf50;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 16px;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #e0e0e0;
    border-color: #ccc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  padding: 16px;
  background-color: #fee;
  border: 2px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

export const AccessDenied = styled.div`
  padding: 40px;
  text-align: center;
  color: #c62828;
  font-size: 18px;
  font-weight: 600;
`;
