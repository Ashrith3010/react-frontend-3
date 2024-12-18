import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DonationManager from './DonationManager';
import AvailableFood from './FoodAvailability';
import NGODirectory from './NGODirectory';
import Contact from './Contact';
import Header from './Header';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats({
          donors: data.totalDonors,
          ngos: data.totalNGOs,
          donations: data.totalDonations,
          active: data.activeDonations
        });
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const intervalId = setInterval(fetchStats, 300000);
    return () => clearInterval(intervalId);
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header userType={userType} />
      
      <main>
        <Routes>
          <Route path="/" element={
            <div>
              <section>
                <h1>Welcome to Food Donation Network</h1>
                <p>Connecting generous donors with NGOs to reduce food waste and feed those in need.</p>
              </section>

              {error && <div className="error">{error}</div>}

              <div className="stats">
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="loading"></div>
                  ))
                ) : (
                  <>
                    <div>
                      <p>{stats?.donors || 0}</p>
                      <p>Active Donors</p>
                    </div>
                    <div>
                      <p>{stats?.ngos || 0}</p>
                      <p>NGO Partners</p>
                    </div>
                    <div>
                      <p>{stats?.donations || 0}</p>
                      <p>Total Donations</p>
                    </div>
                    <div>
                      <p>{stats?.active || 0}</p>
                      <p>Active Donations</p>
                    </div>
                  </>
                )}
              </div>

              <div className="services">
                <div>
                  <h2>For Donors</h2>
                  <ul>
                    <li>Easy-to-use donation platform</li>
                    <li>Real-time tracking of donations</li>
                    <li>Direct connection with local NGOs</li>
                    <li>Impact tracking and reporting</li>
                  </ul>
                </div>

                <div>
                  <h2>For NGOs</h2>
                  <ul>
                    <li>Real-time food availability updates</li>
                    <li>Efficient claim and pickup system</li>
                    <li>Donor communication platform</li>
                    <li>Distribution management tools</li>
                  </ul>
                </div>
              </div>
            </div>
          } />

          {userType === 'donor' && (
            <Route path="/donate" element={<DonationManager />} />
          )}
          <Route path="/available-food" element={<AvailableFood />} />
          <Route path="/ngo-directory" element={<NGODirectory />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;