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
router.delete('/cancel/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // ✅ If payment method is 'razorpay', just update the status
    if (order.paymentMethod === 'razorpay') {
      order.status = 'Cancelled';
      await order.save();
      return res.status(200).json({ message: 'Order status updated to Cancelled (Razorpay)' });
    }

    // ✅ For non-Razorpay orders, delete the order
    const deleted = await Order.findByIdAndDelete(orderId);

    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete order after updating' });
    }

    res.status(200).json({ message: 'Order status updated and deleted from MongoDB' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel and delete order' });
  }
});



module.exports = router;
