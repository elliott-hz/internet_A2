import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as S from './ChangePassword.styles';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Validate new password length
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    const result = await changePassword(oldPassword, newPassword);
    
    if (result.success) {
      setSuccess('Password changed successfully! Redirecting to login...');
      // Clear form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Logout and redirect to home page after 2 seconds
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } else {
      setError(result.error || 'Failed to change password');
    }
    
    setLoading(false);
  };

  return (
    <S.ChangePasswordContainer>
      <S.ChangePasswordForm onSubmit={handleSubmit}>
        <S.ChangePasswordTitle>Change Password</S.ChangePasswordTitle>
        
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        {success && <S.SuccessMessage>{success}</S.SuccessMessage>}
        
        <S.FormGroup>
          <S.Label htmlFor="oldPassword">Current Password</S.Label>
          <S.Input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
            required
            autoComplete="current-password"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="newPassword">New Password</S.Label>
          <S.Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 8 characters)"
            required
            autoComplete="new-password"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="confirmPassword">Confirm New Password</S.Label>
          <S.Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            autoComplete="new-password"
          />
        </S.FormGroup>

        <S.ChangePasswordButton type="submit" disabled={loading}>
          {loading ? 'Changing Password...' : 'Change Password'}
        </S.ChangePasswordButton>
        
        <S.BackLink onClick={() => navigate('/')}>
          ← Back to home page
        </S.BackLink>
      </S.ChangePasswordForm>
    </S.ChangePasswordContainer>
  );
};

export default ChangePassword;
