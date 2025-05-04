const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentId: {
    type: String,
    default: null,
  },
  orderId: {
    type: String,
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      size: String, // Added size
    },
  ],
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod'], // Match with frontend strings
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
