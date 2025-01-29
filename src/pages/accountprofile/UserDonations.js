import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Clock, CheckCircle, Package, Calendar } from 'lucide-react';
import Header from '../dashboard/Header';
import '../styles/account settings/UserDonations.css'
const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "default" }) => (
  <span className={`badge ${type}`}>
    {children}
  </span>
);

const DateFilter = ({ dateRange, onDateRangeChange }) => (
  <div className="date-filter">
    <div className="filter-header">
      <Calendar className="w-5 h-5 text-gray-600" />
      <h3>Filter by Date</h3>
    </div>
    <select 
      value={dateRange} 
      onChange={(e) => onDateRangeChange(e.target.value)}
      className="date-select"
    >
      <option value="all">All Time</option>
      <option value="today">Today</option>
      <option value="week">This Week</option>
      <option value="month">This Month</option>
      <option value="year">This Year</option>
    </select>
  </div>
);

const DonationStats = ({ donations, onCategoryClick, activeCategory, dateRange, onDateRangeChange }) => {
  const stats = {
    total: donations.length,
    claimed: donations.filter((d) => d.claimed).length,
    expired: donations.filter((d) => !d.claimed && new Date(d.expiryTime) < new Date()).length,
    available: donations.filter((d) => !d.claimed && new Date(d.expiryTime) > new Date()).length,
  };

  return (
    <div className="stats-wrapper">
      <div className="stats-container">
        <div 
          className={`stat-card ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryClick('all')}
        >
          <div className="stat-title">
            <Layout className="w-5 h-5 text-blue-600" />
            <h3>Total Donations</h3>
          </div>
          <p className="stat-value total">{stats.total}</p>
        </div>

        <div 
          className={`stat-card ${activeCategory === 'available' ? 'active' : ''}`}
          onClick={() => onCategoryClick('available')}
        >
          <div className="stat-title">
            <Package className="w-5 h-5 text-purple-600" />
            <h3>Available</h3>
          </div>
          <p className="stat-value available">{stats.available}</p>
        </div>

        <div 
          className={`stat-card ${activeCategory === 'claimed' ? 'active' : ''}`}
          onClick={() => onCategoryClick('claimed')}
        >
          <div className="stat-title">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3>Claimed</h3>
          </div>
          <p className="stat-value claimed">{stats.claimed}</p>
        </div>

        <div 
          className={`stat-card ${activeCategory === 'expired' ? 'active' : ''}`}
          onClick={() => onCategoryClick('expired')}
        >
          <div className="stat-title">
            <Clock className="w-5 h-5 text-red-600" />
            <h3>Expired</h3>
          </div>
          <p className="stat-value expired">{stats.expired}</p>
        </div>

        <div className="filters-sidebar">
          <DateFilter 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      </div>
    </div>
  );
};

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-tabs">
      <button 
        className={`tab ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onCategoryChange('all')}
      >
        All Donations
      </button>
      <button 
        className={`tab ${activeCategory === 'available' ? 'active' : ''}`}
        onClick={() => onCategoryChange('available')}
      >
        Available
      </button>
      <button 
        className={`tab ${activeCategory === 'claimed' ? 'active' : ''}`}
        onClick={() => onCategoryChange('claimed')}
      >
        Claimed
      </button>
      <button 
        className={`tab ${activeCategory === 'expired' ? 'active' : ''}`}
        onClick={() => onCategoryChange('expired')}
      >
        Expired
      </button>
    </div>
  );
};

const Skeleton = () => (
  <div className="skeleton"></div>
);

const UserDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get("http://localhost:8080/api/donations/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const sortedDonations = response.data.donations.sort((a, b) => 
          new Date(b.expiryTime) - new Date(a.expiryTime)
        );
        setDonations(sortedDonations);
      } else {
        throw new Error(response.data.message || "Failed to fetch donations");
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch donations.");
      setLoading(false);
    }
  };

  const filterDonationsByDate = (donations) => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return donations.filter(d => {
          const donationDate = new Date(d.expiryTime);
          return donationDate.toDateString() === now.toDateString();
        });
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return donations.filter(d => new Date(d.expiryTime) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return donations.filter(d => new Date(d.expiryTime) >= monthAgo);
      case 'year':
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        return donations.filter(d => new Date(d.expiryTime) >= yearAgo);
      default:
        return donations;
    }
  };

  const filterDonations = () => {
    const now = new Date();
    let filtered = donations;
    
    switch (activeCategory) {
      case 'available':
        filtered = donations.filter(d => !d.claimed && new Date(d.expiryTime) > now);
        break;
      case 'claimed':
        filtered = donations.filter(d => d.claimed);
        break;
      case 'expired':
        filtered = donations.filter(d => !d.claimed && new Date(d.expiryTime) < now);
        break;
    }
    
    return filterDonationsByDate(filtered);
  };

  return (
    <div className="donations-container">
      <Header />
      <div className="content">
        <div className="page-section">
          <div className="page-header">
            <h2 className="page-title">My Donations</h2>
            <p className="page-subtitle">
              Manage and track all your food donations
            </p>
          </div>

          {!loading && donations.length > 0 && (
            <div className="dashboard-layout">
              <div className="main-content">
                <DonationStats 
                  donations={filterDonationsByDate(donations)}
                  onCategoryClick={setActiveCategory}
                  activeCategory={activeCategory}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
                <CategoryTabs 
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
                <div className="donations-grid">
                  {filterDonations().map((donation) => (
                    <Card key={donation.id} className={`donation-card ${
                      donation.claimed ? 'claimed' : 
                      new Date(donation.expiryTime) < new Date() ? 'expired' : 'available'
                    }`}>
                      <div className="card-header">
                        <h3 className="card-title">{donation.foodItem}</h3>
                        <Badge type={
                          donation.claimed ? 'claimed' : 
                          new Date(donation.expiryTime) < new Date() ? 'expired' : 'available'
                        }>
                          {donation.claimed ? 'Claimed' : 
                           new Date(donation.expiryTime) < new Date() ? 'Expired' : 'Available'}
                        </Badge>
                      </div>
                      <div className="card-content">
                        <div className="info-column">
                          <p><strong>Quantity:</strong> {donation.quantity}</p>
                          <p><strong>Location:</strong> {donation.location}, {donation.area}</p>
                          <p><strong>Expiry:</strong> {new Date(donation.expiryTime).toLocaleString()}</p>
                          <p><strong>Serving Size:</strong> {donation.servingSize}</p>
                          <p><strong>Storage:</strong> {donation.storageInstructions}</p>
                          <p><strong>Dietary Info:</strong> {donation.dietaryInfo}</p>
                          
                          {donation.claimed && (
                            <>
                              <p><strong>Claimed By:</strong> {donation.claimedBy}</p>
                              <p><strong>Claimed At:</strong> {new Date(donation.claimedAt).toLocaleString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="skeleton-container">
              {[1, 2, 3].map((n) => (
                <Card key={n}>
                  <div className="skeleton-content">
                    <Skeleton />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card className="error-card">
              <p className="error-message">{error}</p>
            </Card>
          )}

          {!loading && donations.length === 0 && (
            <Card>
              <p className="no-donations">No donations found.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDonations;