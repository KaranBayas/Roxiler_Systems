import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { storeService } from '../services/api';
import '../styles/Stores.css';

export const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchStores();
  }, [page, search]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStores({
        page,
        limit: 10,
        search,
      });
      setStores(response.data.data);
      setTotal(response.data.pagination.total);
    } catch (error) {
      addToast('Failed to fetch stores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStore = (storeId) => {
    navigate(`/stores/${storeId}`);
  };

  return (
    <div className="stores-container">
      <div className="stores-header">
        <h1>Browse Stores</h1>
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="empty-state">No stores found</div>
      ) : (
        <>
          <div className="stores-grid">
            {stores.map((store) => (
              <div key={store.id} className="store-card">
                <h3>{store.name}</h3>
                <p className="store-address">{store.address}</p>
                <p className="store-city">{store.city}, {store.state} {store.zipCode}</p>
                {store.description && <p className="store-description">{store.description}</p>}
                <button
                  onClick={() => handleViewStore(store.id)}
                  className="btn-view"
                >
                  View Details & Rate
                </button>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 10 >= total}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
