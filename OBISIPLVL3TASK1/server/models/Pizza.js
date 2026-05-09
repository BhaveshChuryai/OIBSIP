/**
 * Pizza Model
 * Stores preset pizza varieties available on the menu.
 */
const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  defaultConfig: {
    base: String,
    sauce: String,
    cheese: String,
    veggies: [String]
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pizza', pizzaSchema);
