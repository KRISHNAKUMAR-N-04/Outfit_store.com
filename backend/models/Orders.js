const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  paymentId: String,
  orderId: String,
  amount: Number,
  items: Object,
  status: String,
  createdAt: Date,
});

module.exports = mongoose.model('Order', orderSchema);
