/**
 * Inventory Model
 * Tracks stock levels for all pizza ingredients with configurable alert thresholds.
 */
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'veggie'],
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 100
  },
  threshold: {
    type: Number,
    default: 20,
    min: 0
  },
  unit: {
    type: String,
    default: 'units'
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual to check if stock is low
inventorySchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.threshold;
});

// Ensure virtuals are included in JSON
inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);
