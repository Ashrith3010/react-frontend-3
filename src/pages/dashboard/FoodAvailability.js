// AvailableFood.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  Paper,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Person,
  Restaurant,
  ShoppingBasket,
  Refresh,
  Search,
  Schedule,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';

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

const TIME_FILTERS = {
  'expiring': 'Expiring Soon',
  'recent': 'Recently Posted',
  'all': 'All Times'
};

const AvailableFood = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateFilter, setDateFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 300000);
    return () => clearInterval(interval);
  }, [selectedCity, dateFilter, timeFilter]);

  const getFilteredDate = () => {
    const now = new Date();
    switch (dateFilter) {
      case 'day': return new Date(now.setDate(now.getDate() - 1));
      case 'week': return new Date(now.setDate(now.getDate() - 7));
      case 'month': return new Date(now.setMonth(now.getMonth() - 1));
      case 'year': return new Date(now.setFullYear(now.getFullYear() - 1));
      default: return null;
    }
  };

  const sortDonations = (donations) => {
    switch (timeFilter) {
      case 'expiring':
        return [...donations].sort((a, b) => new Date(a.expiryTime) - new Date(b.expiryTime));
      case 'recent':
        return [...donations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return donations;
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to view donations');

      const filterDate = getFilteredDate();
      const queryParams = new URLSearchParams({
        view: 'available',
        status: 'active',
        ...(selectedCity && { city: selectedCity }),
        ...(filterDate && { fromDate: filterDate.toISOString() })
      });

      const response = await fetch(
        `http://localhost:8080/api/donations?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch donations');
      }

      const data = await response.json();
      const now = new Date();
      const validDonations = (data.donations || []).filter(donation => {
        const expiryDate = new Date(donation.expiryTime);
        return expiryDate > now && (!selectedCity || 
          INDIAN_CAPITAL_CITIES[selectedCity]?.includes(donation.city));
      });

      setDonations(sortDonations(validDonations));
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

      const response = await fetch(
        `http://localhost:8080/api/donations/${donationId}/claim`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim donation');
      }

      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation.id === donationId ? { ...donation, claimed: true } : donation
        )
      );

      setNotification({
        type: 'success',
        message: 'Donation claimed successfully! Email notification sent to donor.',
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message,
      });
    }
  };

  const getTimeRemaining = (expiryTime) => {
    const timeLeft = new Date(expiryTime) - currentTime;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    if (hoursLeft <= 0) return 'Expired';
    if (hoursLeft <= 24) return `${hoursLeft} hours left`;
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(expiryTime));
  };

  const getExpiryColor = (expiryTime) => {
    const hoursLeft = Math.floor(
      (new Date(expiryTime) - currentTime) / (1000 * 60 * 60)
    );
    if (hoursLeft <= 4) return 'error';
    if (hoursLeft <= 12) return 'warning';
    if (hoursLeft <= 24) return 'primary';
    return 'default';
  };

  if (error) {
    return (
      <Alert severity="error" className="mt-16 mx-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient">
      <Header />
      <br/>
      <br/>
      <br/>
      <br/>
      <div className="content-wrapper">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hero-banner"
        >
          <Typography variant="h3" className="hero-title">
            Available Food Donations
          </Typography>
          <Typography variant="h6" className="hero-subtitle">
            Connect with donors and reduce food waste
          </Typography>
        </motion.div>

        <Paper className="filter-container">
          <Box className="filter-box">
            <FormControl className="filter-control">
              <InputLabel>Select City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="Select City"
                startAdornment={<Search className="filter-icon" />}
              >
                <MenuItem value="">All Cities</MenuItem>
                {Object.keys(INDIAN_CAPITAL_CITIES).map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="filter-control">
              <InputLabel>Time Filter</InputLabel>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                label="Time Filter"
                startAdornment={<Schedule className="filter-icon" />}
              >
                {Object.entries(TIME_FILTERS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={dateFilter}
              exclusive
              onChange={(e, value) => setDateFilter(value || 'all')}
              className="date-toggle"
            >
              <ToggleButton value="day">Today</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="year">Year</ToggleButton>
              <ToggleButton value="all">All Time</ToggleButton>
            </ToggleButtonGroup>

            <IconButton
              onClick={() => {
                setRefreshing(true);
                fetchDonations().then(() => setTimeout(() => setRefreshing(false), 1000));
              }}
              className={`refresh-button ${refreshing ? 'spinning' : ''}`}
            >
              <Refresh />
            </IconButton>
          </Box>
        </Paper>

        <Snackbar
          open={!!notification}
          autoHideDuration={3000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={notification?.type} onClose={() => setNotification(null)}>
            {notification?.message}
          </Alert>
        </Snackbar>

        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : donations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state"
          >
            <img src="/api/placeholder/200/200" alt="No donations" className="empty-image" />
            <Typography variant="h6" className="empty-title">No Food Donations Available</Typography>
            <Typography variant="body1" className="empty-subtitle">
              Check back later or try different filters
            </Typography>
          </motion.div>
        ) : (
          <AnimatePresence>
            <Grid container spacing={4} className="donations-grid">
              {donations.map((donation, index) => (
                <Grid item xs={12} md={6} lg={4} key={donation.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="donation-card-wrapper"
                  >
                    <Card className="donation-card">
                      <CardContent className="donation-content">
                        <Typography variant="h6" className="donation-title">
                          <Restaurant className="icon-teal" />
                          {donation.foodItem}
                        </Typography>

                        <div className="donation-details">
                          <Typography variant="body2" className="detail-item">
                            <Person className="icon-teal" />
                            {donation.donorName}
                          </Typography>
                          <Typography variant="body2" className="detail-item">
                            <LocationOn className="icon-teal" />
                            {donation.location}, {donation.area}
                          </Typography>
                          <Typography variant="body2" className="detail-item">
                            <ShoppingBasket className="icon-teal" />
                            {donation.quantity} kg
                          </Typography>
                        </div>

                        <div className="expiry-chip">
                          <Chip
                            icon={<AccessTime />}
                            label={getTimeRemaining(donation.expiryTime)}
                            color={getExpiryColor(donation.expiryTime)}
                            className="full-width-chip"
                          />
                        </div>

                        {userType === 'ngo' && (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleClaim(donation.id)}
                            disabled={donation.claimed}
                            className={`claim-button ${donation.claimed ? 'claimed' : ''}`}
                          >
                            {donation.claimed ? 'Already Claimed' : 'Claim Donation'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AvailableFood;