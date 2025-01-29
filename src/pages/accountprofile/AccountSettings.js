import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  FormControlLabel,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Header from "../dashboard/Header";
import '../styles/account settings/accountsetting.css';

export const AccountSettings = () => {
  const [userSettings, setUserSettings] = useState({
    notifications: true,
    emailUpdates: true,
    privacyMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token is missing. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/account/settings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserSettings(response.data.data || userSettings);
        setLoading(false);
      } catch (err) {
        setError("Failed to load account settings");
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [navigate]);

  const handleSettingsUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

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

      setSuccess(true);
    } catch (err) {
      setError("Failed to update settings");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  return (
    <>
    <Header/>
    <br/>
    <br/>
    <br/>
    <Box>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Settings updated successfully</Alert>
      </Snackbar>
      <Box className="account-settings-container">
        <Box className="sidebar">
          <Typography variant="h5">Settings</Typography>
          <ul>
            <li className="active">Account Settings</li>
            <li>
              <Link to="/change-password">Change Password</Link>
            </li>
          </ul>
        </Box>
        <Paper className="content" elevation={3}>
          <Typography variant="h4" gutterBottom>Account Settings</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={userSettings.notifications}
                onChange={(e) =>
                  setUserSettings({ ...userSettings, notifications: e.target.checked })
                }
              />
            }
            label="Enable Notifications"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={userSettings.emailUpdates}
                onChange={(e) =>
                  setUserSettings({ ...userSettings, emailUpdates: e.target.checked })
                }
              />
            }
            label="Email Updates"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={userSettings.privacyMode}
                onChange={(e) =>
                  setUserSettings({ ...userSettings, privacyMode: e.target.checked })
                }
              />
            }
            label="Privacy Mode"
          />
          <Button variant="contained" color="primary" onClick={handleSettingsUpdate}>
            Save Settings
          </Button>
        </Paper>
      </Box>
    </Box>
    </>
  );
};

export default AccountSettings;
