/**
 * Inventory Controller
 * Manages stock levels for all pizza ingredients (admin operations).
 */
const Inventory = require('../models/Inventory');

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory items (admin only)
 */
const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ category: 1, name: 1 });
    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

/**
 * @route   PUT /api/inventory/:id
 * @desc    Update inventory item quantity (admin only)
 */
const updateInventory = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity value' });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory updated', item });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Failed to update inventory' });
  }
};

/**
 * @route   PUT /api/inventory/:id/threshold
 * @desc    Update low-stock threshold for an item (admin only)
 */
const updateThreshold = async (req, res) => {
  try {
    const { threshold } = req.body;

    if (threshold === undefined || threshold < 0) {
      return res.status(400).json({ message: 'Invalid threshold value' });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { threshold },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ message: 'Threshold updated', item });
  } catch (error) {
    console.error('Update threshold error:', error);
    res.status(500).json({ message: 'Failed to update threshold' });
  }
};

module.exports = {
  getAllInventory,
  updateInventory,
  updateThreshold
};
