import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Apple,
  Building2,
  Heart,
  Share2,
  MessageCircle,
  LogOut,
  Settings,
  User,
  Key
} from 'lucide-react';
import '../styles/header.css';

const Header = () => {
  // State management
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refs and hooks
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user type from local storage
  const userType = localStorage.getItem('userType');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const API_BASE_URL = 'http://localhost:8080'; // Changed from 3001 to 8080


  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching profile with token:', token); // Debug log

        const response = await axios.get(`${API_BASE_URL}/api/account/profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });

        console.log('Profile response:', response.data); // Debug log

        // Updated to match the backend response structure
        if (response.data && response.data.data) {
          setUserProfile(response.data.data);
          setError(null);
        } else {
          throw new Error('Invalid profile data structure');
        }
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status
        });

        if (error.message === 'Network Error') {
          setError('Cannot connect to server. Please check if the backend is running.');
        } else if (error.response?.status === 403) {
          setError('Session expired. Please log in again.');
          handleLogout();
        } else {
          setError('Failed to fetch profile: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Determine if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle menu item click
  const handleMenuItemClick = (route) => {
    navigate(route);
    setDropdownOpen(false);
  };

  // Render navigation links based on user type
  const renderNavLinks = () => (
    <div className="nav-links">
      <Link to="/dashboard" className={isActiveLink('/dashboard')}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </Link>
      <Link to="/available-food" className={isActiveLink('/available-food')}>
        <Apple size={20} />
        <span>Available Food</span>
      </Link>
      <Link to="/ngo-directory" className={isActiveLink('/ngo-directory')}>
        <Building2 size={20} />
        <span>NGO Directory</span>
      </Link>
      {userType === 'donor' && (
        <Link to="/donate" className={isActiveLink('/donate')}>
          <Heart size={20} />
          <span>Donate</span>
        </Link>
      )}
      {userType === 'ngo' && (
        <Link to="/donate" className={isActiveLink('/DonationManager')}>
          <Share2 size={20} />
          <span>Share Food</span>
        </Link>
      )}
      <Link to="/contact" className={isActiveLink('/contact')}>
        <MessageCircle size={20} />
        <span>Contact</span>
      </Link>
    </div>
  );

  // Render user dropdown menu
  const renderDropdownMenu = () => {
    // Get first letter of username, default to 'U' if no username
    const initial = userProfile?.username 
      ? userProfile.username.charAt(0).toUpperCase() 
      : 'U';

    return (
      <div className="dropdown-menu">
        <div className="user-info">
          <div className="dropdown-profile-initial">
            {initial}
          </div>
          <div>
            <p className="username">{userProfile?.username || 'Guest'}</p>
            <p className="user-email">{userProfile?.email || 'No email'}</p>
            <p className="user-type">{userProfile?.type?.toUpperCase() || 'USER'} Account</p>
          </div>
        </div>
        <div className="dropdown-divider"></div>
        <button
          onClick={() => handleMenuItemClick('/account-settings')}
          className="dropdown-item"
        >
          <Settings size={16} /> Account Settings
        </button>
        <button
          onClick={() => handleMenuItemClick('/accountprofile')}
          className="dropdown-item"
        >
          <User size={16} /> My Profile
        </button>
        <button
          onClick={() => handleMenuItemClick('/change-password')}
          className="dropdown-item"
        >
          <Key size={16} /> Change Password
        </button>
        <button
          onClick={() => handleMenuItemClick('/user-donations')}
          className="dropdown-item"
        >
          <Share2 size={16} /> Manage Donations
        </button>
        <div className="dropdown-divider"></div>
        <button onClick={handleLogout} className="dropdown-item logout">
          <LogOut size={16} /> Logout
        </button>
      </div>
    );
  };

  // Main render
  return (
    <header className="site-header">
      {error && (
        <div className="error-banner">
          Unable to load user profile. Please log in again.
        </div>
      )}
      <div className="header-container">
        <nav className="header-nav">
          {renderNavLinks()}
        </nav>
        <div className="user-section" ref={dropdownRef}>
          {loading ? (
            <div className="profile-loading">Loading...</div>
          ) : (
            <div className="profile-trigger" onClick={toggleDropdown}>
              <div className="profile-initial">
                {userProfile?.username 
                  ? userProfile.username.charAt(0).toUpperCase() 
                  : 'U'}
              </div>
            </div>
          )}
          {dropdownOpen && userProfile && renderDropdownMenu()}
        </div>
      </div>
    </header>
  );
};

export default Header;