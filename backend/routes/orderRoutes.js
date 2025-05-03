const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const protect = require('../middlware/authMiddleware'); // your current protect middleware

// Create Order (COD and Online)
router.post('/create', protect, async (req, res) => {
  try {
    const newOrder = new Order({
      userId: req.user._id,
      paymentId: req.body.paymentId || null,
      orderId: req.body.orderId || null,
      amount: req.body.amount,
      items: req.body.items,
      paymentMethod: req.body.paymentMethod || 'Online',
    });const express = require('express');
    const router = express.Router();
    const Order = require('../models/Order');
    const protect = require('../middleware/authMiddleware'); // your current protect middleware
    
    // Create Order (COD and Online)
    router.post('/create', protect, async (req, res) => {
      try {
        const newOrder = new Order({
          userId: req.user._id,
          paymentId: req.body.paymentId || null,
          orderId: req.body.orderId || null,
          amount: req.body.amount,
          items: req.body.items,
          paymentMethod: req.body.paymentMethod || 'Online',
        });
    
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
      } catch (err) {
        res.status(500).json({ message: 'Order creation failed', error: err.message });
      }
    });
    
    // Get all orders of logged-in user
    router.get('/all', protect, async (req, res) => {
      try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
      }
    });
    
    module.exports = router;
    

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// Get all orders of logged-in user
router.get('/all', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

module.exports = router;
