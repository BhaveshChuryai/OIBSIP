/**
 * Login Page
 * User login form with email/password and redirect on success.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      if (err.response?.data?.needsVerification) {
        setTimeout(() => navigate('/verify-email', { state: { email } }), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <span className="auth-emoji">🍕</span>
          <h1>Welcome Back</h1>
          <p>Log in to your PizzaHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="login-email"><FiMail /> Email</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password"><FiLock /> Password</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Link to="/forgot-password" className="auth-link forgot-link" id="forgot-password-link">
            Forgot password?
          </Link>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : <><FiLogIn /> Log In</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link" id="goto-register">Sign up</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
