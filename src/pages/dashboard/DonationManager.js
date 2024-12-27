import React, { useState } from 'react';
import Header from './Header';
import '../styles/donation-manager.css';

const DonationManager = () => {
  const INDIAN_CITIES = [
    'New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 
    'Hyderabad', 'Kolkata', 'Lucknow', 'Jaipur', 
    'Bhopal', 'Chandigarh', 'Pune', 'Ahmedabad', 
    'Surat', 'Patna', 'Indore', 'Nagpur'
  ];

  const [formData, setFormData] = useState({
    foodItem: '',
    quantity: 10,
    location: '',
    area: '',
    expiryTime: '',
    servingSize: 1,
    storageInstructions: '',
    dietaryInfo: '',
  });

  const [notification, setNotification] = useState({
    message: '',
    type: '',
  });

  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCitySelect = (city) => {
    setFormData({ ...formData, location: city });
    setShowCityDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Basic validation
    if (!formData.location || !formData.area) {
      setNotification({ 
        message: 'Please provide both location and area', 
        type: 'error' 
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          quantity: formData.quantity.toString(),
          servingSize: formData.servingSize.toString(),
          expiryTime: formData.expiryTime 
            ? new Date(formData.expiryTime).toISOString() 
            : null
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNotification({ 
          message: 'Donation posted successfully!', 
          type: 'success' 
        });
        setFormData({
          foodItem: '',
          quantity: 10,
          location: '',
          area: '',
          expiryTime: '',
          servingSize: 1,
          storageInstructions: '',
          dietaryInfo: '',
        });
      } else {
        setNotification({ 
          message: result.message || 'Failed to post donation', 
          type: 'error' 
        });
      }
    } catch (error) {
      setNotification({ 
        message: 'An error occurred. Please try again later.', 
        type: 'error' 
      });
      console.error('Donation submission error:', error);
    }
  };

  return (
    <div className="donation-manager">
      <Header />
      <div className="donation-form-page">
        <h1 className="donation-form-title">Post Food Donation</h1>

        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' ? (
              <i className="notification-icon">✓</i>
            ) : (
              <i className="notification-icon">✕</i>
            )}
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="donation-form">
          <div>
            <label>Food Item</label>
            <input
              type="text"
              name="foodItem"
              value={formData.foodItem}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Quantity (servings)</label>
            <input
              type="range"
              name="quantity"
              min="1"
              max="100"
              value={formData.quantity}
              onChange={handleInputChange}
            />
            <span>{formData.quantity}</span>
          </div>

          <div>
            <label>City (Location)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              onFocus={() => setShowCityDropdown(true)}
              required
            />
            {showCityDropdown && (
              <ul className="city-dropdown">
                {INDIAN_CITIES.map((city, index) => (
                  <li key={index} onClick={() => handleCitySelect(city)}>
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label>Area/Locality</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              required
              placeholder="Enter your specific area or neighborhood"
            />
          </div>

          <div>
            <label>Best Before Time</label>
            <input
              type="datetime-local"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Serving Size</label>
            <input
              type="range"
              name="servingSize"
              min="1"
              max="10"
              value={formData.servingSize}
              onChange={handleInputChange}
            />
            <span>{formData.servingSize}</span>
          </div>

          <div>
            <label>Storage Instructions</label>
            <textarea
              name="storageInstructions"
              value={formData.storageInstructions}
              onChange={handleInputChange}
              placeholder="Optional: Add any specific storage or handling instructions"
            ></textarea>
          </div>

          <div>
            <label>Dietary Information</label>
            <textarea
              name="dietaryInfo"
              value={formData.dietaryInfo}
              onChange={handleInputChange}
              placeholder="Optional: Provide details about dietary restrictions or ingredients"
            ></textarea>
          </div>

          <button type="submit">Post Donation</button>
        </form>
      </div>
    </div>
  );
};

export default DonationManager;