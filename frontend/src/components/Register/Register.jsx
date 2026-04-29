import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as S from './Register.styles';

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
    // If successful, user will be auto-logged in and UI will update
  };

  return (
    <S.Container>
      <S.Title>Create Account</S.Title>
      <S.Subtitle>Join us to start shopping</S.Subtitle>

      <S.Form onSubmit={handleSubmit}>
        <S.InputGroup>
          <S.Label htmlFor="username">Username</S.Label>
          <S.Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            minLength={3}
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label htmlFor="email">Email</S.Label>
          <S.Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label htmlFor="password">Password</S.Label>
          <S.Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password (min 8 characters)"
            required
            minLength={8}
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label htmlFor="confirmPassword">Confirm Password</S.Label>
          <S.Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </S.InputGroup>

        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        <S.SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </S.SubmitButton>
      </S.Form>

      <S.SwitchText>
        Already have an account?{' '}
        <S.SwitchLink onClick={onSwitchToLogin}>Login here</S.SwitchLink>
      </S.SwitchText>
    </S.Container>
  );
};

export default Register;
