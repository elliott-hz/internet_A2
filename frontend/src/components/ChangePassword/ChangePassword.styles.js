import styled from 'styled-components';

export const ChangePasswordContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 120px);
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

export const ChangePasswordForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ChangePasswordTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
  text-align: center;
  font-weight: 700;
  border-bottom: 2px solid #f5f5f5;
  padding-bottom: 15px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const ChangePasswordButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: #f57c00;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

export const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
`;

export const BackLink = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #333;
  }
`;
