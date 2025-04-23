const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else res.status(403).json({ msg: "Access denied: Admins only" });
};

module.exports = { protect, adminOnly };