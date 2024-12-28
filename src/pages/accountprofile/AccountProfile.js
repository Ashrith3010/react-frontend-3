import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';
import axios from 'axios';

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
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found. Redirecting to login.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/account/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.status === 403) {
          console.log('Unauthorized. Token expired.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (response.data.success) {
          const userData = response.data.data;
          setProfile({
            username: userData.username || '',
            email: userData.email || '',
            phone: userData.phone || '',
            type: userData.type || '',
            organization: userData.organization || '',
            area: userData.area || '',
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
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
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        {!isEditing ? (
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Username:</span> {profile.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {profile.phone}
            </p>
            <p>
              <span className="font-semibold">Account Type:</span>{' '}
              {profile.type?.toUpperCase()}
            </p>
            {profile.type === 'ngo' && (
              <>
                <p>
                  <span className="font-semibold">Organization:</span>{' '}
                  {profile.organization}
                </p>
                <p>
                  <span className="font-semibold">Area:</span> {profile.area}
                </p>
              </>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Username:</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email:</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone:</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {profile.type === 'ngo' && (
              <>
                <div>
                  <label className="block font-semibold mb-1">Organization:</label>
                  <input
                    type="text"
                    value={profile.organization}
                    onChange={(e) =>
                      setProfile({ ...profile, organization: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Area:</label>
                  <input
                    type="text"
                    value={profile.area}
                    onChange={(e) =>
                      setProfile({ ...profile, area: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
            <div className="flex justify-between pt-4">
              <button
                onClick={handleProfileUpdate}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
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
