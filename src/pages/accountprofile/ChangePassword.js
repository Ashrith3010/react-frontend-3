import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/account settings/ChangePassword.css';
import Header from '../dashboard/Header';

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[!@#$%^&*]/.test(pass)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = {
    0: 'Too weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong'
  };

  return (
    <div className="strength-indicator">
      <div className="strength-bars">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`strength-bar ${index < strength ? `level-${strength}` : ''}`}
          />
        ))}
      </div>
      <p className={`strength-text ${strength > 2 ? 'strong' : ''}`}>
        {strengthText[strength]}
      </p>
    </div>
  );
};

const PasswordInput = ({ value, onChange, placeholder, icon: Icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`password-input-container ${isFocused ? 'focused' : ''}`}>
      <div className="input-icon left">
        <Icon size={20} />
      </div>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required
        className="password-input"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="toggle-password"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError('New passwords do not match');
      setMessage(null);
      return;
    }

    setError(null);
    setMessage(null);
    setIsLoading(true);

    const token = localStorage.getItem('token');

    axios
      .post(
        'http://localhost:8080/api/account/change-password',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMessage('Password changed successfully');
        setError(null);
        setIsLoading(false);
        setTimeout(() => navigate('/dashboard'), 2000); // Navigate after 2 seconds
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to change password');
        setMessage(null);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Header />
      <div className="password-change-container">
        <div className="form-card">
          <div className="icon-container">
            <Shield className="shield-icon" />
          </div>

          <h2 className="form-title">Change Password</h2>

          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label className="input-label">Current Password</label>
              <PasswordInput
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                icon={Lock}
              />
            </div>

            <div className="form-group">
              <label className="input-label">New Password</label>
              <PasswordInput
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                placeholder="Enter new password"
                icon={Lock}
              />
              <PasswordStrengthIndicator password={passwords.newPassword} />
            </div>

            <div className="form-group">
              <label className="input-label">Confirm New Password</label>
              <PasswordInput
                value={passwords.confirmNewPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmNewPassword: e.target.value,
                  })
                }
                placeholder="Confirm new password"
                icon={Lock}
              />
            </div>

            {error && (
              <div className="message error">
                <XCircle />
                <p>{error}</p>
              </div>
            )}

            {message && (
              <div className="message success">
                <CheckCircle />
                <p>{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span>Changing Password...</span>
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;