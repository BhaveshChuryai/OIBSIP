/**
 * Navbar Component
 * Responsive navigation bar with auth state, mobile menu, and role-based links.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiShoppingBag, FiLogOut, FiUser, FiShield } from 'react-icons/fi';
import { GiFullPizza } from 'react-icons/gi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <GiFullPizza className="navbar-logo-icon" />
          <span>Pizza<span className="brand-accent">Hub</span></span>
        </Link>

        <button
          className="mobile-toggle"
          id="mobile-toggle-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="nav-link" id="nav-admin-dashboard" onClick={() => setMobileOpen(false)}>
                    <FiShield /> Dashboard
                  </Link>
                  <Link to="/admin/inventory" className="nav-link" id="nav-admin-inventory" onClick={() => setMobileOpen(false)}>
                    📦 Inventory
                  </Link>
                  <Link to="/admin/orders" className="nav-link" id="nav-admin-orders" onClick={() => setMobileOpen(false)}>
                    📋 Orders
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-link" id="nav-dashboard" onClick={() => setMobileOpen(false)}>
                    🍕 Menu
                  </Link>
                  <Link to="/build" className="nav-link" id="nav-build" onClick={() => setMobileOpen(false)}>
                    🛠️ Build Pizza
                  </Link>
                  <Link to="/my-orders" className="nav-link" id="nav-my-orders" onClick={() => setMobileOpen(false)}>
                    <FiShoppingBag /> My Orders
                  </Link>
                </>
              )}
              <div className="nav-user-section">
                <span className="nav-user-name">
                  <FiUser /> {user?.name}
                </span>
                <button className="nav-logout-btn" id="logout-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link nav-link-cta" id="nav-register" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
              <Link to="/admin-login" className="nav-link nav-link-admin" id="nav-admin-login" onClick={() => setMobileOpen(false)}>
                <FiShield /> Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
