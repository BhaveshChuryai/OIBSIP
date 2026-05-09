/**
 * Order Controller
 * Handles order creation, retrieval, and status updates with inventory deduction.
 */
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { getIO } = require('../utils/socket');

/**
 * @route   POST /api/orders
 * @desc    Create a new order and deduct inventory
 */
const createOrder = async (req, res) => {
  try {
    const { pizzaConfig, totalPrice } = req.body;

    // Validate pizza config
    if (!pizzaConfig || !pizzaConfig.base || !pizzaConfig.sauce || !pizzaConfig.cheese) {
      return res.status(400).json({ message: 'Invalid pizza configuration' });
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      pizzaConfig,
      totalPrice,
      status: 'Order Received',
      paymentStatus: 'Paid'
    });

    // Deduct inventory quantities
    const deductions = [
      { name: pizzaConfig.base, category: 'base' },
      { name: pizzaConfig.sauce, category: 'sauce' },
      { name: pizzaConfig.cheese, category: 'cheese' },
      ...((pizzaConfig.veggies || []).map(v => ({ name: v, category: 'veggie' })))
    ];

    for (const item of deductions) {
      await Inventory.findOneAndUpdate(
        { name: item.name, category: item.category, quantity: { $gt: 0 } },
        { $inc: { quantity: -1 } }
      );
    }

    // Emit new order event to admin
    try {
      const io = getIO();
      const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
      io.to('admin').emit('newOrder', populatedOrder);
    } catch (socketErr) {
      // Socket not critical — continue
    }

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: order._id,
        status: order.status,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order. Please try again.' });
  }
};

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get all orders for the logged-in user
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order by ID
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Users can only view their own orders (admins can view any)
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (admin only)
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (admin only) and emit real-time update
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Order Received', 'In the Kitchen', 'Sent to Delivery'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit real-time status update to the user
    try {
      const io = getIO();
      io.to(order.user._id.toString()).emit('orderStatusUpdate', {
        orderId: order._id,
        status: order.status
      });
    } catch (socketErr) {
      // Socket not critical
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
