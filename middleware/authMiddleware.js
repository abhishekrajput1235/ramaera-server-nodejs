const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModal');
const User = require('../models/userModel');

// =====================
// ✅ Protect Admin Route
// =====================
const protectAdminRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    req.admin = admin; // ✅ attach admin info
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};

// =====================
// ✅ Protect User Route
// =====================
const protectUserRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // ✅ attach user info
    next();
  } catch (error) {
    console.error('User auth error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ✅ Export both middlewares correctly
module.exports = {
  protectAdminRoute,
  protectUserRoute
};
