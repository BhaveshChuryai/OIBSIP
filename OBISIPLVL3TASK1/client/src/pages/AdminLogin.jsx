/**
 * Admin Login Page
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiShield, FiMail, FiLock } from 'react-icons/fi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="admin-login-page">
      <motion.div className="auth-card admin-auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-header">
          <span className="auth-emoji"><FiShield /></span>
          <h1>Admin Login</h1>
          <p>Access the restaurant management dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form" id="admin-login-form">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="admin-email"><FiMail /> Email</label>
            <input type="email" id="admin-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@pizza.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password"><FiLock /> Password</label>
            <input type="password" id="admin-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" id="admin-login-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : <><FiShield /> Login as Admin</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
