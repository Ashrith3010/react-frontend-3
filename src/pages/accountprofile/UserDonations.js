import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from '../dashboard/Header';

const UserDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setDonations(response.data.donations);
      } else {
        throw new Error(response.data.message || "Failed to fetch donations");
      }
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
        <div>
          {donations.map((donation) => (
            <div key={donation.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
              <p><strong>Food Item:</strong> {donation.foodItem}</p>
              <p><strong>Quantity:</strong> {donation.quantity}</p>
              <p><strong>Location:</strong> {donation.location}, {donation.area}</p>
              <p><strong>Expiry Time:</strong> {new Date(donation.expiryTime).toLocaleString()}</p>
              <p><strong>Serving Size:</strong> {donation.servingSize}</p>
              <p><strong>Storage Instructions:</strong> {donation.storageInstructions}</p>
              <p><strong>Dietary Info:</strong> {donation.dietaryInfo}</p>
              <p><strong>Claimed:</strong> {donation.claimed ? 'Yes' : 'No'}</p>
              {donation.claimed && (
                <>
                  <p><strong>Claimed By:</strong> {donation.claimedBy}</p>
                  <p><strong>Claimed At:</strong> {new Date(donation.claimedAt).toLocaleString()}</p>
                </>
              )}
              <p><strong>Created At:</strong> {new Date(donation.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(donation.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDonations;