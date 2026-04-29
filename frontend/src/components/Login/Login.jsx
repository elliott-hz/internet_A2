import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Register from '../Register/Register';
import * as S from './Login.styles';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      setPassword('');  // Clear password field on error
      // Keep username, allow user to edit it
    }
    
    setLoading(false);
  };

  if (showRegister) {
    return <Register onSwitchToLogin={() => setShowRegister(false)} />;
  }

  return (
    <S.LoginContainer>
      <S.LoginForm onSubmit={handleSubmit}>
        <S.LoginTitle>Login to Continue</S.LoginTitle>
        
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        
        <S.FormGroup>
          <S.Label htmlFor="username">Username</S.Label>
          <S.Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            autoComplete="username"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="password">Password</S.Label>
          <S.Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            autoComplete="current-password"
          />
        </S.FormGroup>

        <S.LoginButton type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </S.LoginButton>
        
        <S.LoginHint>
          Don't have an account?{' '}
          <S.RegisterLink onClick={() => setShowRegister(true)}>
            Register here
          </S.RegisterLink>
        </S.LoginHint>
      </S.LoginForm>
    </S.LoginContainer>
  );
};

export default Login;
