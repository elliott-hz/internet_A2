import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Register from '../Register/Register';
import * as S from './Login.styles';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      setPassword('');  // Clear password field on error
      // Keep email, allow user to edit it
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
          <S.Label htmlFor="email">Email</S.Label>
          <S.Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
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
        
        <S.AdminHint>
          <S.AdminTooltip>
            Admin Credentials
            <S.TooltipText>Default: admin@example.com / admin123</S.TooltipText>
          </S.AdminTooltip>
        </S.AdminHint>
      </S.LoginForm>
    </S.LoginContainer>
  );
};

export default Login;
