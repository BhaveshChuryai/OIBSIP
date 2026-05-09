/**
 * Pizza Routes
 * Endpoints for fetching pizza menu and ingredients.
 */
const express = require('express');
const router = express.Router();
const { getIngredients, getMenu } = require('../controllers/pizzaController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (user must be logged in)
router.get('/ingredients', protect, getIngredients);
router.get('/menu', protect, getMenu);

module.exports = router;
