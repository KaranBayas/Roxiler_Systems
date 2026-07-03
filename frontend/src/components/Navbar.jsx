import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Navbar.css';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ⭐ Store Rating System
        </Link>

        <div className="navbar-menu">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <>
              <span className="nav-user">{user?.name}</span>
              {user?.role === 'ADMIN' && (
                <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
              )}
              {user?.role === 'STORE_OWNER' && (
                <Link to="/store-owner/dashboard" className="nav-link">Dashboard</Link>
              )}
              {user?.role === 'USER' && (
                <Link to="/user/stores" className="nav-link">Browse Stores</Link>
              )}
              <button onClick={handleLogout} className="nav-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
