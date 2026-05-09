/**
 * Reset Password Page
 * User enters new password using tokenized reset link.
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/authApi';
import { motion } from 'framer-motion';
import { FiLock, FiCheck } from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { data } = await resetPassword(token, { password });
      setSuccess(data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="reset-password-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <span className="auth-emoji">🔒</span>
          <h1>Reset Password</h1>
          <p>Choose a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="reset-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="reset-password"><FiLock /> New Password</label>
            <input
              type="password"
              id="reset-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reset-confirm"><FiLock /> Confirm Password</label>
            <input
              type="password"
              id="reset-confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="reset-submit-btn"
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : <><FiCheck /> Reset Password</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
