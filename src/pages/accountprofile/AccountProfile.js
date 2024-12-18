import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';

// Account Profile Component
export const AccountProfile = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = () => {
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:3001/api/account/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProfile(response.data.profile);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load profile');
          setLoading(false);
        });
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = () => {
    const token = localStorage.getItem('token');
    axios
      .put('http://localhost:3001/api/account/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsEditing(false);
        alert('Profile updated successfully');
      })
      .catch(() => {
        setError('Failed to update profile');
      });
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
    
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>My Profile</h2>
      {!isEditing ? (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Account Type:</strong> {profile.type.toUpperCase()}</p>
          {profile.type === 'ngo' && (
            <>
              <p><strong>Organization:</strong> {profile.organization}</p>
              <p><strong>Area:</strong> {profile.area}</p>
            </>
          )}
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label>
              <strong>Username:</strong>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>
              <strong>Phone:</strong>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </label>
          </div>
          {profile.type === 'ngo' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Organization:</strong>
                  <input
                    type="text"
                    value={profile.organization}
                    onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label>
                  <strong>Area:</strong>
                  <input
                    type="text"
                    value={profile.area}
                    onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                  />
                </label>
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={handleProfileUpdate}
            >
              Save
            </button>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#f8f9fa',
                color: '#000',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AccountProfile;
