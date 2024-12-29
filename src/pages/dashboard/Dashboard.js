import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Form } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DonationManager from './DonationManager';
import AvailableFood from './FoodAvailability';
import NGODirectory from './NGODirectory';
import Contact from './Contact';
import { Card,CardContent } from '../ui/Card';
import { Alert, AlertDescription  } from '../ui/Alert';
import { Progress } from '../ui/Progress';
import { 
  Users, 
  Building2, 
  Heart, 
  Package, 
  ArrowUpRight,
  Utensils,
  Clock,
  Share2
} from 'lucide-react';
import '../styles/dashboard.css';
import Header from './Header';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  const API_BASE_URL = 'http://localhost:8080/api/stats';

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_BASE_URL, {
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
        setProgress(100);
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

  const statsConfig = [
    { title: 'Active Donors', value: stats?.totalDonors || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'NGO Partners', value: stats?.totalNGOs || 0, icon: Building2, color: 'bg-green-500' },
    { title: 'Total Donations', value: stats?.totalDonations || 0, icon: Heart, color: 'bg-purple-500' },
    { title: 'Active Donations', value: stats?.activeDonations || 0, icon: Package, color: 'bg-orange-500' }
  ];

  const recentActivity = [
    { type: 'donation', message: 'New donation from Restaurant A', time: '5 minutes ago', icon: Utensils },
    { type: 'pickup', message: 'Food pickup completed by NGO B', time: '15 minutes ago', icon: Share2 },
    { type: 'donation', message: 'New donation from Supermarket C', time: '1 hour ago', icon: Utensils }
  ];

  const StatsCard = ({ title, value, Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="stats-card"
    >
      <Card className="h-full">
        <CardContent className="p-6 flex items-center">
          <div className={`icon-wrapper ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="stats-value">{loading ? '-' : value}</p>
            <p className="stats-title">{title}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto transform transition-transform group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </motion.div>
  );

  const ActivityFeed = () => (
    <Card className="activity-feed">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="activity-item"
            >
              <div className={`activity-icon ${activity.type === 'donation' ? 'bg-green-100' : 'bg-blue-100'}`}>
                <activity.icon className={`h-4 w-4 ${activity.type === 'donation' ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <p className="activity-time">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (

    <>
    <Header/>
    <div className="dashboard">
      <Progress value={progress} className="progress-bar" />
      <main className="dashboard-main">
        <Routes>
          <Route
            path="/"
            element={
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="dashboard-content"
                >
                  <section className="welcome-section">
                    <motion.h1
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="main-title"
                    >
                      Welcome to Food Donation Network
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="subtitle"
                    >
                      Connecting generous donors with NGOs to reduce food waste and feed those in need.
                    </motion.p>
                  </section>

                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="stats-grid">
                    {statsConfig.map((stat, index) => (
                      <StatsCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        Icon={stat.icon}
                        color={stat.color}
                      />
                    ))}
                  </div>

                  <div className="dashboard-grid">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="col-span-2"
                    >
                      <ActivityFeed />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="quick-actions"
                    >
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                          {userType === 'donor' ? (
                            <button className="quick-action-btn">
                              <Heart className="h-5 w-5" />
                              Create New Donation
                            </button>
                          ) : (
                            <button className="quick-action-btn">
                              <Share2 className="h-5 w-5" />
                              View Available Donations
                            </button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
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
    </>
  );
};

export default Dashboard;