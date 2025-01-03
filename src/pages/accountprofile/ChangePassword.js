import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';

export const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    e.preventDefault();

    // Validation for matching new passwords
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError('New passwords do not match');
      setMessage(null);
      return;
    }

    setError(null);
    setMessage(null);
    setIsLoading(true); // Start loading state

    const token = localStorage.getItem('token');

    // Send request to change the password
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
        setIsLoading(false); // Stop loading state on error
      });
  };

  return (
    <div>
      <Header />

      <div
        style={{
          maxWidth: '400px',
          margin: 'auto',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2>Change Password</h2>
        <form
          onSubmit={handlePasswordChange}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <label>
              Current Password:
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </label>
          </div>
          <div>
            <label>
              New Password:
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </label>
          </div>
          <div>
            <label>
              Confirm New Password:
              <input
                type="password"
                value={passwords.confirmNewPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </label>
          </div>

          {/* Display error message */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Display success message */}
          {message && <p style={{ color: 'green' }}>{message}</p>}

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
