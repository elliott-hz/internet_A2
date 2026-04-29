import styled from 'styled-components';

export const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: calc(120px + 20px);
  max-height: calc(100vh - (120px + 40px));
`;

export const LoginForm = styled.form`
  background: transparent;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const LoginTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
  text-align: center;
  font-weight: 700;
  border-bottom: 2px solid #f5f5f5;
  padding-bottom: 12px;
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

export const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: #45a049;
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

export const LoginHint = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.5;
`;

export const RegisterLink = styled.span`
  color: #4caf50;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    color: #45a049;
  }
`;
