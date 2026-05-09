/**
 * Inventory Routes
 * Admin endpoints for managing ingredient stock levels.
 */
const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  updateInventory,
  updateThreshold
} = require('../controllers/inventoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All inventory routes are admin-only
router.get('/', protect, adminOnly, getAllInventory);
router.put('/:id', protect, adminOnly, updateInventory);
router.put('/:id/threshold', protect, adminOnly, updateThreshold);

module.exports = router;
