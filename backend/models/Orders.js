// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentId: String,
  orderId: String,
  amount: Number,
  items: [
    {
      productId: String,
      size: String,
      quantity: Number
    }
  ],
  status: { type: String, default: 'Placed' },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
