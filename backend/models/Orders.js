const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  status: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Order', orderSchema);
