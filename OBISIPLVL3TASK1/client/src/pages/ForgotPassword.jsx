/**
 * Forgot Password Page
 * User enters email to receive a password reset link.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/authApi';
import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await forgotPassword({ email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="forgot-password-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <span className="auth-emoji">🔑</span>
          <h1>Forgot Password</h1>
          <p>We'll send you a reset link via email</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="forgot-form">
          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <div className="form-group">
            <label htmlFor="forgot-email"><FiMail /> Email Address</label>
            <input
              type="email"
              id="forgot-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="forgot-submit-btn"
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : <><FiSend /> Send Reset Link</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Remember your password? <Link to="/login" className="auth-link">Log in</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
