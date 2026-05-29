const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Also check Authorization header as fallback
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized, please login', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new AppError('User not found', 401));
    }

    next();
  } catch (error) {
    next(new AppError('Not authorized, token failed', 401));
  }
};

// Role-based access
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new AppError('Access denied. Admin only.', 403));
  }
};

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    next(new AppError('Access denied. Student only.', 403));
  }
};

module.exports = { protect, isAdmin, isStudent };
