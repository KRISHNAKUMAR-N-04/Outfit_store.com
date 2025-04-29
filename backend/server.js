const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);


const razorpay = new Razorpay({
  key_id: "rzp_test_PH2VKUNXERfp6h", // Replace with your Key ID
  key_secret: "6feKuWtdqUu05fb8D7X3C21X", // Replace with your Key Secret
});



app.post('/api/payment/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: 'order_rcptid_' + Math.random(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });  
})
.catch((err) => {
  console.error('Database connection error:', err);
});
