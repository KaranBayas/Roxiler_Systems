import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import '../styles/StoreOwnerDashboard.css';

export const StoreOwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // Fetch store stats (would be based on store owner's store)
      // For demo, we'll show empty state
      setStats({
        averageRating: 4.5,
        totalRatings: 12,
        ratingDistribution: { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 },
      });
      setRatings([]);
    } catch (error) {
      addToast('Failed to fetch dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="store-owner-dashboard">
      <h1>Store Owner Dashboard</h1>

      {stats && (
        <div className="stats-section">
          <div className="stat-card">
            <h3>Average Rating</h3>
            <p className="stat-value">{stats.averageRating} / 5</p>
          </div>
          <div className="stat-card">
            <h3>Total Ratings</h3>
            <p className="stat-value">{stats.totalRatings}</p>
          </div>
          <div className="stat-card">
            <h3>5 Star Ratings</h3>
            <p className="stat-value">{stats.ratingDistribution['5']}</p>
          </div>
          <div className="stat-card">
            <h3>4 Star Ratings</h3>
            <p className="stat-value">{stats.ratingDistribution['4']}</p>
          </div>
        </div>
      )}

      <div className="ratings-section">
        <h2>Recent Ratings</h2>
        {ratings.length === 0 ? (
          <p className="no-data">No ratings yet</p>
        ) : (
          <div className="ratings-list">
            {ratings.map((rating) => (
              <div key={rating.id} className="rating-item">
                <span>{rating.user.name}</span>
                <span className="stars">{'★'.repeat(rating.score)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
