/**
 * Pizza Controller
 * Serves pizza menu items and available ingredients for the pizza builder.
 */
const Inventory = require('../models/Inventory');
const Pizza = require('../models/Pizza');

/**
 * @route   GET /api/pizza/ingredients
 * @desc    Get all available ingredients grouped by category
 */
const getIngredients = async (req, res) => {
  try {
    const ingredients = await Inventory.find({ quantity: { $gt: 0 } });

    // Group ingredients by category
    const grouped = {
      bases: ingredients.filter(i => i.category === 'base'),
      sauces: ingredients.filter(i => i.category === 'sauce'),
      cheeses: ingredients.filter(i => i.category === 'cheese'),
      veggies: ingredients.filter(i => i.category === 'veggie')
    };

    res.json(grouped);
  } catch (error) {
    console.error('Get ingredients error:', error);
    res.status(500).json({ message: 'Failed to fetch ingredients' });
  }
};

/**
 * @route   GET /api/pizza/menu
 * @desc    Get all preset pizza varieties
 */
const getMenu = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.json(pizzas);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ message: 'Failed to fetch menu' });
  }
};

module.exports = {
  getIngredients,
  getMenu
};
