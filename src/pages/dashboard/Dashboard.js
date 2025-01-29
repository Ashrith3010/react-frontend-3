import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
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
  Share2,
  TrendingUp 
} from 'lucide-react';
import '../styles/dashboard.css';
import Header from './Header';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/activity/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities);
      setError(null);
    } catch (err) {
      setError('Failed to load recent activity');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const intervalId = setInterval(fetchActivities, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const getTimeAgo = (timestamp) => {
    const minutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  if (loading) {
    return (
      <Card className="activity-feed">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="activity-feed">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={`${activity.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="activity-item"
                >
                  <div className={`activity-icon ${activity.type === 'donation' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {activity.type === 'donation' ? 
                      <Utensils className="h-4 w-4 text-green-600" /> : 
                      <Share2 className="h-4 w-4 text-blue-600" />
                    }
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <p className="activity-time">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
const StatsCard = ({ title, value, Icon, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="stats-card relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`icon-wrapper ${color} transform transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <motion.div
              animate={{ rotate: isHovered ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight className="h-5 w-5 text-gray-400" />
            </motion.div>
          </div>
          
          <div className="mt-4">
            <motion.div
              className="stats-value-container relative"
              animate={{ y: isHovered ? -4 : 0 }}
            >
              <span className="stats-value">
                {value}
              </span>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
                className="absolute -right-6 top-0"
              >
                <TrendingUp className="h-4 w-4 text-green-500" />
              </motion.div>
            </motion.div>
            <p className="stats-title mt-1">{title}</p>
          </div>

          {isHovered && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"
              style={{ width: '100%', transformOrigin: 'left' }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
// Rest of your existing components (ActivityFeed, etc.) remain the same

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
                              <Link to="/donate" className="quick-action-btn inline-flex items-center">
                                <Heart className="h-5 w-5" />
                                Create New Donation
                              </Link>
                            ) : (
                              <Link to="/available-food" className="quick-action-btn inline-flex items-center">
                                <Share2 className="h-5 w-5" />
                                View Available Donations
                              </Link>
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
