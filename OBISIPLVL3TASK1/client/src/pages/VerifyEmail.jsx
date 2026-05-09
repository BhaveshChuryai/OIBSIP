/**
 * Verify Email Page
 * User enters OTP sent to their email to verify their account.
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';
import { motion } from 'framer-motion';
import { FiMail, FiCheck } from 'react-icons/fi';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await verifyEmail({ email, otp });
      setSuccess(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="verify-email-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <span className="auth-emoji">📧</span>
          <h1>Verify Email</h1>
          <p>Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="verify-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="verify-email"><FiMail /> Email</label>
            <input
              type="email"
              id="verify-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="verify-otp">🔢 Verification Code</label>
            <input
              type="text"
              id="verify-otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
              maxLength={6}
              className="otp-input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="verify-submit-btn"
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : <><FiCheck /> Verify Email</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
