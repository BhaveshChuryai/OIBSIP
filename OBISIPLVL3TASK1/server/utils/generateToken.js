/**
 * JWT Token Generator
 * Creates access tokens (short-lived) and refresh tokens (long-lived).
 */
const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived access token (15 minutes)
 * @param {string} userId - MongoDB user ID
 * @param {string} role - User role (user/admin)
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate a long-lived refresh token (7 days)
 * @param {string} userId - MongoDB user ID
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateOTP
};
