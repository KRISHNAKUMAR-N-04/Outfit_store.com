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



// POST route to create Razorpay order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // ₹10 becomes 1000 paise
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order); // sends back order.id, etc.
  } catch (err) {
    res.status(500).send(err);
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((err) => {
  console.error('Database connection error:', err);
});
