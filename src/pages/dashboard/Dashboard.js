import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DonationManager from './DonationManager';
import AvailableFood from './FoodAvailability';
import NGODirectory from './NGODirectory';
import Contact from './Contact';
import Header from './Header';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  const API_BASE_URL = 'http://localhost:8080/api/stats';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }

        const statsData = await response.json();
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
      const intervalId = setInterval(fetchStats, 300000);
      return () => clearInterval(intervalId);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.dashboard}>
      <Header userType={userType} />

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={
            <div>
              <section className={styles.welcomeSection}>
                <h1>Welcome to Food Donation Network</h1>
                <p>Connecting generous donors with NGOs to reduce food waste and feed those in need.</p>
              </section>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.stats}>
                {loading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className={styles.loading}></div>
                  ))
                ) : (
                  <>
                    <div>
                      <p>{stats?.totalDonors || 0}</p>
                      <p>Active Donors</p>
                    </div>
                    <div>
                      <p>{stats?.totalNGOs || 0}</p>
                      <p>NGO Partners</p>
                    </div>
                    <div>
                      <p>{stats?.totalDonations || 0}</p>
                      <p>Total Donations</p>
                    </div>
                    <div>
                      <p>{stats?.activeDonations || 0}</p>
                      <p>Active Donations</p>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.services}>
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
          }
          />
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
