import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import Header from "../dashboard/Header";

// Account Settings Component
export const AccountSettings = () => {
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    emailUpdates: true,
    privacyMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  // Fetch user settings on component load
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if the token exists
        if (!token) {
          setError("Token is missing. Please log in.");
          navigate("/login");  // Redirect to login page using navigate
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/account/settings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Assuming the API response wraps settings in a `data` object
        setUserSettings(response.data.data || userSettings);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("Access forbidden. Please log in again.");
          navigate("/login"); // Redirect to login if token is invalid
        } else {
          setError("Failed to load account settings");
        }
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [navigate]);

  // Update settings when user clicks "Save Settings"
  const handleSettingsUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      // Check if the token exists
      if (!token) {
        setError("Token is missing. Please log in.");
        navigate("/login");
        return;
      }

      await axios.put(
        "http://localhost:8080/api/account/settings",
        userSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Settings updated successfully");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Access forbidden. Please log in again.");
        navigate("/login");
      } else {
        setError("Failed to update settings");
      }
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
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
