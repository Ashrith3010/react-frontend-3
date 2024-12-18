import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../dashboard/Header';

// Account Settings Component
export const AccountSettings = () => {
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    emailUpdates: true,
    privacyMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/account/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSettings(response.data.settings);
        setLoading(false);
      } catch (err) {
        setError('Failed to load account settings');
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  const handleSettingsUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/api/account/settings', userSettings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>{error}</div>;

  return (

    <div><Header />
    <div className="account-settings-container">
      <div className="sidebar">
        <ul>
          <li className="active">Account Settings</li>
          <li>
            <Link to="/change-password">Change Password</Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <h2>Account Settings</h2>
        <div className="settings-item">
          <label>
            Enable Notifications
            <input
              type="checkbox"
              checked={userSettings.notifications}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  notifications: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="settings-item">
          <label>
            Email Updates
            <input
              type="checkbox"
              checked={userSettings.emailUpdates}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  emailUpdates: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <div className="settings-item">
          <label>
            Privacy Mode
            <input
              type="checkbox"
              checked={userSettings.privacyMode}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  privacyMode: e.target.checked,
                })
              }
            />
          </label>
        </div>
        <button onClick={handleSettingsUpdate}>Save Settings</button>
      </div>
    </div>
    </div>
  );
};

export default AccountSettings;
