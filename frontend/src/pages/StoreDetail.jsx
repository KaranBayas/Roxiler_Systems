import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { storeService, ratingService } from '../services/api';
import '../styles/StoreDetail.css';

export const StoreDetail = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStore();
    fetchRatings();
    checkUserRating();
  }, [storeId]);

  const fetchStore = async () => {
    try {
      const response = await storeService.getStore(parseInt(storeId));
      setStore(response.data.data);
    } catch (error) {
      addToast('Failed to fetch store', 'error');
      navigate('/user/stores');
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await ratingService.getStoreRatings(parseInt(storeId));
      setRatings(response.data.data);
    } catch (error) {
      addToast('Failed to fetch ratings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRating = async () => {
    if (!user || user.role === 'ADMIN') return;

    try {
      const response = await ratingService.checkUserRating(parseInt(storeId));
      if (response.data.data) {
        setUserRating(response.data.data);
        setScore(response.data.data.score);
        setComment(response.data.data.comment);
      }
    } catch (error) {
      // No rating yet
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (!user || user.role === 'ADMIN') {
      addToast('Only users can submit ratings', 'error');
      return;
    }

    setSubmitting(true);

    try {
      if (userRating) {
        await ratingService.updateRating(userRating.id, { score, comment });
        addToast('Rating updated successfully', 'success');
      } else {
        await ratingService.submitRating({
          storeId: parseInt(storeId),
          score: parseInt(score),
          comment,
        });
        addToast('Rating submitted successfully', 'success');
      }

      fetchRatings();
      checkUserRating();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit rating';
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading store details...</div>;
  if (!store) return <div className="empty-state">Store not found</div>;

  return (
    <div className="store-detail-container">
      <button onClick={() => navigate('/user/stores')} className="btn-back">← Back</button>

      <div className="store-detail">
        <h1>{store.name}</h1>
        <div className="store-info">
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>City:</strong> {store.city}, {store.state} {store.zipCode}</p>
          {store.description && <p><strong>Description:</strong> {store.description}</p>}
          <p><strong>Average Rating:</strong> {store.averageRating} / 5 ({store.totalRatings} ratings)</p>
        </div>

        {user && user.role !== 'ADMIN' && (
          <div className="rating-form">
            <h2>{userRating ? 'Update Your Rating' : 'Submit a Rating'}</h2>
            <form onSubmit={handleSubmitRating}>
              <div className="form-group">
                <label>Score</label>
                <select
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value))}
                  disabled={submitting}
                >
                  {[5, 4, 3, 2, 1].map((s) => (
                    <option key={s} value={s}>{s} Star{s !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  maxLength="1000"
                  disabled={submitting}
                  rows="4"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-submit"
              >
                {submitting ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
              </button>
            </form>
          </div>
        )}

        <div className="ratings-list">
          <h2>All Ratings ({ratings.length})</h2>
          {ratings.length === 0 ? (
            <p className="no-ratings">No ratings yet. Be the first to rate!</p>
          ) : (
            <div className="ratings">
              {ratings.map((rating) => (
                <div key={rating.id} className="rating-item">
                  <div className="rating-header">
                    <span className="rater-name">{rating.user.name}</span>
                    <span className="rating-score">{'★'.repeat(rating.score)}{'☆'.repeat(5 - rating.score)}</span>
                  </div>
                  {rating.comment && <p className="rating-comment">{rating.comment}</p>}
                  <p className="rating-date">{new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
