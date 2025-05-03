const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/create', async (req, res) => {
  try {
    const { paymentId, orderId, amount, items } = req.body;

    const newOrder = new Order({
      paymentId,
      orderId,
      amount,
      items,
      status: 'Processing',
    });

    await newOrder.save();

    res.status(200).json({ success: true, message: 'Order saved', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to save order' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
