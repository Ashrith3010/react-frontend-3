import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from '../dashboard/Header';
 
const UserDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch donations made by the logged-in user
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Retrieve JWT token

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get("http://localhost:3001/api/donations/user", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to headers
        },
      });

      setDonations(response.data.donations); // Set fetched donations
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch donations.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div>
      <Header />
      <h2>My Donations</h2>

      {loading && <p>Loading donations...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && donations.length === 0 && <p>No donations found.</p>}

      {!loading && donations.length > 0 && (
        <ul>
          {donations.map((donation) => (
            <li key={donation.id}>
              <strong>Amount:</strong> ${donation.quantity} <br />
              <strong>Food Item:</strong> {donation.foodItem} <br />
              <strong>Location:</strong> {donation.location}, {donation.area} <br />
              <strong>Expiry Time:</strong> {new Date(donation.expiryTime).toLocaleDateString()} <br />
              <strong>Claimed:</strong> {donation.claimed ? 'Yes' : 'No'} <br />
              {donation.claimed && (
                <>
                  <strong>Claimed By:</strong> {donation.claimedBy} <br />
                  <strong>Claimed At:</strong> {new Date(donation.claimedAt).toLocaleString()} <br />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDonations;
