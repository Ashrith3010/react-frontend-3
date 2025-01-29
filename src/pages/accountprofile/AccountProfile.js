import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/account settings/accountProfile.css';
import Header from '../dashboard/Header';
const AccountProfile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    type: '',
    organization: '',
    area: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedAnimation, setSavedAnimation] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/account/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/api/account/profile`, profile, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setSavedAnimation(true);
        setIsEditing(false);
        setTimeout(() => setSavedAnimation(false), 2000);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  const ProfileField = ({ icon, label, value }) => (
    <div className="profile-field">
      <span className="field-icon">{icon}</span>
      <div className="field-content">
        <div className="field-label">{label}</div>
        <div className="field-value">{value}</div>
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange }) => (
    <div className="input-field">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  return (
    <>
    <Header/>
    <br/>
    <br/>
    <br/>
  
    <div className="profile-container">
      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}
      
      <div className={`profile-card ${savedAnimation ? 'saved' : ''}`}>
        <div className="card-header">
          <div className="header-content">
            <div className="avatar">👤</div>
            <h2 className="profile-title">My Profile</h2>
          </div>
        </div>
        
        <div className="card-content">
          {!isEditing ? (
            <div className="animate-fade-in">
              <ProfileField icon="👤" label="Username" value={profile.username} />
              <ProfileField icon="✉️" label="Email" value={profile.email} />
              <ProfileField icon="📱" label="Phone" value={profile.phone} />
              <ProfileField icon="🏢" label="Account Type" value={profile.type?.toUpperCase()} />
              {profile.type === 'ngo' && (
                <>
                  <ProfileField icon="🏢" label="Organization" value={profile.organization} />
                  <ProfileField icon="📍" label="Area" value={profile.area} />
                </>
              )}
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="animate-slide-up">
              <InputField
                label="Username"
                value={profile.username}
                onChange={(v) => setProfile({...profile, username: v})}
              />
              <InputField
                label="Email"
                value={profile.email}
                onChange={(v) => setProfile({...profile, email: v})}
              />
              <InputField
                label="Phone"
                value={profile.phone}
                onChange={(v) => setProfile({...profile, phone: v})}
              />
              {profile.type === 'ngo' && (
                <>
                  <InputField
                    label="Organization"
                    value={profile.organization}
                    onChange={(v) => setProfile({...profile, organization: v})}
                  />
                  <InputField
                    label="Area"
                    value={profile.area}
                    onChange={(v) => setProfile({...profile, area: v})}
                  />
                </>
              )}
              <div className="button-group">
                <button 
                  className="btn btn-primary"
                  onClick={handleProfileUpdate}
                >
                  Save Changes
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AccountProfile;