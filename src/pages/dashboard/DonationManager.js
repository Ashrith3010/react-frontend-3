import React, { useState } from 'react';
import { Clock, MapPin, UtensilsCrossed, Info, Package } from 'lucide-react';
import '../styles/donation-manager.css';
import Header from './Header';

// Card Component
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

// Alert Component
const Alert = ({ children, type }) => (
  <div className={`p-4 rounded-md mb-4 ${
    type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
  }`}>
    {children}
  </div>
);

// Input Component
const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

// Textarea Component
const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

// Button Component
const Button = ({ children, className = '', disabled, ...props }) => (
  <button
    className={`w-full px-4 py-2 text-white font-medium rounded-md 
    ${disabled 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-blue-600 hover:bg-blue-700'} 
    transition-colors ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// Slider Component
const Slider = ({ value, onChange, min, max }) => (
  <div className="w-full">
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, location: city }));
    setShowCityDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    if (!formData.location || !formData.area) {
      setNotification({ 
        message: 'Please provide both location and area', 
        type: 'error' 
      });
      setIsSubmitting(false);
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
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
    <Header />
    <br />
    <br />
    <div className="fd-container">
      <div className="fd-wrapper">
        <div className="fd-card">
          <div className="fd-card-header">
            <h1 className="fd-title">Post Food Donation</h1>
            <p className="fd-subtitle">Share your excess food with those in need</p>
          </div>
          
          {notification.message && (
            <div className={`fd-notification ${notification.type === 'success' ? 'fd-notification-success' : 'fd-notification-error'}`}>
              <span className="fd-notification-icon">
                {notification.type === 'success' ? '✓' : '⚠'}
              </span>
              <p className="fd-notification-text">{notification.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="fd-form">
            <div className="fd-form-section">
              <h2 className="fd-section-title">Basic Information</h2>
              <div className="fd-form-group">
                <label className="fd-label">
                  <UtensilsCrossed className="fd-icon" />
                  Food Item
                </label>
                <input
                  className="fd-input"
                  name="foodItem"
                  value={formData.foodItem}
                  onChange={handleInputChange}
                  required
                  placeholder="What food items are you donating?"
                />
              </div>

              <div className="fd-form-group">
  <label className="fd-label">
    <Package className="fd-icon" />
    Quantity (servings in kgs)
  </label>
  <div className="fd-slider-container">
    <input
      type="range"
      className="fd-slider"
      name="quantity"
      min="1"
      max="100"
      value={formData.quantity}
      onChange={handleInputChange}
    />
    <input
      type="number"
      className="fd-slider-input"
      name="quantity"
      min="1"
      max="100"
      value={formData.quantity}
      onChange={handleInputChange}
    />
  </div>
</div>

            </div>

            <div className="fd-form-section">
              <h2 className="fd-section-title">Location Details</h2>
              <div className="fd-form-group">
                <label className="fd-label">
                  <MapPin className="fd-icon" />
                  City
                </label>
                <div className="fd-dropdown-container">
                  <input
                    className="fd-input"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    onFocus={() => setShowCityDropdown(true)}
                    required
                    placeholder="Select your city"
                  />
                  {showCityDropdown && (
                    <ul className="fd-dropdown-list">
                      {INDIAN_CITIES.map((city, index) => (
                        <li
                          key={index}
                          className="fd-dropdown-item"
                          onClick={() => handleCitySelect(city)}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="fd-form-group">
                <label className="fd-label">
                  <MapPin className="fd-icon" />
                  Area/Locality
                </label>
                <input
                  className="fd-input"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your specific area or neighborhood"
                />
              </div>
            </div>

            <div className="fd-form-section">
              <h2 className="fd-section-title">Food Details</h2>
              <div className="fd-form-group">
                <label className="fd-label">
                  <Clock className="fd-icon" />
                  Best Before Time
                </label>
                <input
                  className="fd-input"
                  type="datetime-local"
                  name="expiryTime"
                  value={formData.expiryTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="fd-form-group">
                <label className="fd-label">
                  <Info className="fd-icon" />
                  Storage Instructions
                </label>
                <textarea
                  className="fd-textarea"
                  name="storageInstructions"
                  value={formData.storageInstructions}
                  onChange={handleInputChange}
                  placeholder="How should this food be stored? Any handling instructions?"
                  rows={3}
                />
              </div>

              <div className="fd-form-group">
                <label className="fd-label">
                  <Info className="fd-icon" />
                  Dietary Information
                </label>
                <textarea
                  className="fd-textarea"
                  name="dietaryInfo"
                  value={formData.dietaryInfo}
                  onChange={handleInputChange}
                  placeholder="Any allergens? Is it vegetarian/vegan/halal?"
                  rows={3}
                />
              </div>
            </div>

            <button 
              type="submit"
              className={`fd-submit-button ${isSubmitting ? 'fd-button-loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="fd-loading-text">Posting your donation...</span>
              ) : (
                'Post Donation'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default DonationManager;