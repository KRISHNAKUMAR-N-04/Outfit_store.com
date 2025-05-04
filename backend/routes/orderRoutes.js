const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const protect = require('../middlware/authMiddleware'); // Check spelling of 'middleware'

// Create Order (COD or Razorpay)
router.post('/create', protect, async (req, res) => {
  try {
    const { paymentId, orderId, amount, items, paymentMethod } = req.body;

    // Basic validation
    if (!amount || !items || !items.length || !paymentMethod) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    console.log("Incoming order data:", req.body);
    console.log("Logged-in user:", req.user);

    const newOrder = new Order({
      user: req.user._id,
      paymentId: paymentId || null,
      orderId: orderId || null,
      amount,
      items,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({
      message: 'Order creation failed',
      error: err.message,
      stack: err.stack
    });
  }
});

// Get all orders for the logged-in user
router.get('/all', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

module.exports = router;
