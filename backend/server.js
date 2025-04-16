const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Outfit.store", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB error:", err));

app.use("/api/auth", authRoutes); // This enables /api/auth/signup

app.get("/", (req, res) => {
  res.send("Backend running");
});
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working!" });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
