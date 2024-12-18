import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../styles/ngo-directory.css';

const NGODirectory = () => {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view the NGO directory');
        }
        const response = await fetch('http://localhost:3001/api/ngos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 403) {
          throw new Error('You do not have permission to view the NGO directory');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch NGO directory');
        }

        const data = await response.json();
        setNGOs(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, []);

 
  if (loading) {
    return (
      <div className="directory-container">
        <Header />
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="directory-container">
      <Header />
      <h2 className="directory-title">NGO Directory</h2>

      {error ? (
        <div className="error-message">{error}</div>
      ) : ngos.length === 0 ? (
        <div className="empty-message">
          No NGOs registered at the moment.
        </div>
      ) : (
        <div className="directory-grid">
          {ngos.map((ngo) => (
            <div key={ngo.id} className="ngo-card">
              <h3 className="ngo-title">{ngo.organization}</h3>
              <div className="ngo-info">
                <span className="ngo-label">Area:</span>
                <span className="ngo-value">{ngo.area}</span>
              </div>
              <div className="ngo-info">
                <span className="ngo-label">Phone:</span>
                <span className="ngo-value">{ngo.phone}</span>
              </div>
              <div className="ngo-info">
                <span className="ngo-label">Email:</span>
                <span className="ngo-value">{ngo.email}</span>
              </div>
              {ngo.description && (
                <div className="ngo-description">
                  <p>{ngo.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NGODirectory;