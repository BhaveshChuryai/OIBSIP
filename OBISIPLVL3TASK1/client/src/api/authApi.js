/**
 * Auth API helpers
 */
import API from './axios';

export const registerUser = (data) => API.post('/auth/register', data);
export const verifyEmail = (data) => API.post('/auth/verify-email', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const adminLogin = (data) => API.post('/auth/admin-login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => API.post(`/auth/reset-password/${token}`, data);
export const refreshToken = (data) => API.post('/auth/refresh-token', data);
export const getMe = () => API.get('/auth/me');
