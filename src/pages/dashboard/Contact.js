import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../styles/contact.css';
import ContactImage from '../styles/contact.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  // Load user information on component mount
  useEffect(() => {
    // Retrieve user information from localStorage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    console.log('Stored Username:', username);
    console.log('Stored Email:', email);

    // Pre-fill form with user information if available
    if (username || email) {
      setFormData(prevData => ({
        ...prevData,
        name: username || '',
        email: email || ''
      }));
    } else {
      console.warn('No username or email found in localStorage');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token:', token);
  
    if (!token) {
      setStatus('Please log in to send a message.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      // Check if the response is empty
      if (response.status === 204) {
        setStatus('No content returned from the server.');
        return;
      }
  
      // Get the raw response text
      const text = await response.text();
  
      if (response.ok) {
        setStatus(text || 'Message sent successfully!');
        setFormData(prevData => ({
          ...prevData,
          message: '', // Keep name and email, clear only message
        }));
      } else {
        setStatus(`Failed to send message: ${text || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(`Failed to send message: ${error.message}`);
      console.error('Submit error:', error);
    }
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="contact-page-wrapper">
      <Header />
      <div className="contact-form-container">
        <div className="contact-form-wrapper">
          <h2 className="contact-heading">Let's talk about everything!</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="contact-form-input"
                required
              />
            </div>
            <div className="contact-form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="contact-form-input"
                required
              />
            </div>
            <div className="contact-form-group">
              <textarea
                name="message"
                placeholder="Write your message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="contact-form-textarea"
                required
              />
            </div>
            <button type="submit" className="contact-submit-button">
              Send Message
            </button>
          </form>
          {status && (
            <div
              className={`contact-status-message ${
                status.includes('Failed')
                  ? 'contact-status-error'
                  : 'contact-status-success'
              }`}
            >
              {status}
            </div>
          )}
        </div>
        <div className="contact-image-container">
          <img src={ContactImage} alt="Contact" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
