import React, { useState, useEffect } from 'react';
import Header from './Header';

const AvailableFood = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const userType = localStorage.getItem('userType');

  const INDIAN_CAPITAL_CITIES = {
    'New Delhi': ['Delhi', 'New Delhi', 'NCR'],
    'Mumbai': ['Mumbai', 'Bombay'],
    'Bangalore': ['Bangalore', 'Bengaluru'],
    'Chennai': ['Chennai', 'Madras'],
    'Hyderabad': ['Hyderabad', 'Secunderabad'],
    'Kolkata': ['Kolkata', 'Calcutta'],
    'Lucknow': ['Lucknow'],
    'Jaipur': ['Jaipur'],
    'Bhopal': ['Bhopal'],
    'Chandigarh': ['Chandigarh'],
  };

  useEffect(() => {
    fetchDonations();
  }, [selectedCity]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view donations');
      }

      const queryParams = new URLSearchParams({
        view: 'available',
        status: 'active',
        ...(selectedCity && { city: selectedCity }),
      });

      const response = await fetch(`http://localhost:8080/api/donations?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch donations');
      }

      const data = await response.json();
      setDonations(data.donations || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to claim donations');

      const response = await fetch(`http://localhost:8080/api/donations/${donationId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim donation');
      }

      const { updatedDonation } = await response.json();

      // Update the donations list to mark the claimed donation
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation.id === donationId ? { ...donation, claimed: true } : donation
        )
      );

      setNotification({
        type: 'success',
        message: 'Donation claimed successfully! Email notification has been sent to the donor.',
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message,
      });
    }

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  const formatExpiryTime = (expiryTime) => {
    const expiry = new Date(expiryTime);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(expiry);
  };

  if (loading) {
    return (
      <div className="food-container">
        <Header />
        <div className="loading-message">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="food-container">
        <Header />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="food-container">
      <Header />
      <div className="food-header">
        <h2 className="food-title">Available Food Donations</h2>

        <div className="filters">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="city-filter"
          >
            <option value="">All Cities</option>
            {Object.keys(INDIAN_CAPITAL_CITIES).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notification && (
        <div
          className={`notification ${
            notification.type === 'error' ? 'notification-error' : 'notification-success'
          }`}
        >
          {notification.message}
        </div>
      )}

      {donations.length === 0 ? (
        <div className="empty-message">No food donations available at the moment.</div>
      ) : (
        <div className="food-grid">
          {donations.map((donation) => (
            <div key={donation.id} className="food-card">
              <h3 className="food-card-title">{donation.foodItem}</h3>
              <div className="food-card-info">
                <p>
                  <span className="food-card-label">Posted by:</span> {donation.donorName}
                </p>
                <p>
                  <span className="food-card-label">Location:</span> {donation.location}
                </p>
                <p>
                  <span className="food-card-label">Area:</span> {donation.area}
                </p>
                <p>
                  <span className="food-card-label">Quantity:</span> {donation.quantity}
                </p>
                <p>
                  <span className="food-card-label">Best before:</span> {formatExpiryTime(donation.expiryTime)}
                </p>
              </div>

              {userType === 'ngo' && (
                <button
                  onClick={() => handleClaim(donation.id)}
                  className="claim-button"
                  disabled={donation.claimed}
                >
                  {donation.claimed ? 'Already Claimed' : 'Claim Donation'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableFood;
