const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config(); // Make sure to use dotenv for secrets

// Replace with your actual credentials
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_PH2VKUNXERfp6h",
  key_secret: "6feKuWtdqUu05fb8D7X3C21X",
});

router.post('/create-order', async (req, res) => {
    try {
      const { amount } = req.body;
      console.log("Received amount:", amount);
  
      if (!amount || isNaN(amount)) {
        return res.status(400).json({ success: false, message: 'Invalid or missing amount' });
      }
  
      const options = {
        amount: parseInt(amount), // Razorpay expects amount in paise
        currency: "INR",
        receipt: "receipt_order_" + Date.now(),
      };
  
      const order = await razorpayInstance.orders.create(options);
      console.log("Order created:", order);
  
      return res.status(200).json(order);
    } catch (err) {
      console.error("Razorpay error:", err); // 👈 this will help us debug the issue
      return res.status(500).json({ error: "Failed to create Razorpay order", details: err.message });
    }
  });

module.exports = router;


