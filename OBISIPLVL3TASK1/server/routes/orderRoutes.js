/**
 * Order Routes
 * Endpoints for order CRUD and status management.
 */
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes (protected)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

// Admin routes (protected + admin only) — must be before :id route
router.get('/admin/all', protect, adminOnly, getAllOrders);

// Shared route (users can view their own, admins can view any)
router.get('/:id', protect, getOrderById);

// Admin-only status update
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
