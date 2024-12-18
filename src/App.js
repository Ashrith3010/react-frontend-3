import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DonationManager from './pages/dashboard/DonationManager';
import AvailableFood from './pages/dashboard/FoodAvailability';
import NGODirectory from './pages/dashboard/NGODirectory';
import Contact from './pages/dashboard/Contact';
import Dashboard from './pages/dashboard/Dashboard';
import AccountProfile from './pages/accountprofile/AccountProfile';
import AccountSettings from './pages/accountprofile/AccountSettings';
import ChangePassword from './pages/accountprofile/ChangePassword';
import UserDonations from './pages/accountprofile/UserDonations';
const App = () => {
  const token = localStorage.getItem('token');  // Check token here

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect root to dashboard if logged in */}
        <Route path="/" element={token ? <Navigate to="/login" /> : <Login />} />
        
        {/* Protect dashboard routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/donate" element={<PrivateRoute><DonationManager /></PrivateRoute>} />
        <Route path="/available-food" element={<PrivateRoute><AvailableFood /></PrivateRoute>} />
        <Route path="/ngo-directory" element={<PrivateRoute><NGODirectory /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/accountprofile" element={<AccountProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/user-donations" element={<UserDonations />} />


      </Routes>
    </Router>
  );
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default App;
