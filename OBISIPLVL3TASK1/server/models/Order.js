/**
 * Order Model
 * Stores pizza orders with config, pricing, status tracking, and user reference.
 */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pizzaConfig: {
    base: {
      type: String,
      required: true
    },
    sauce: {
      type: String,
      required: true
    },
    cheese: {
      type: String,
      required: true
    },
    veggies: [{
      type: String
    }]
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Order Received', 'In the Kitchen', 'Sent to Delivery'],
    default: 'Order Received'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Paid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
