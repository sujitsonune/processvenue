const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token && process.env.NODE_ENV === 'production') {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  // Skip authentication in development if no token provided
  if (!token && process.env.NODE_ENV !== 'production') {
    req.user = { id: 1 }; // Default user for development
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      logger.warn('Invalid token attempt:', err.message);
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey && process.env.NODE_ENV === 'production') {
    return res.status(401).json({
      success: false,
      message: 'API key required'
    });
  }

  // Skip API key check in development
  if (!apiKey && process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (apiKey !== process.env.API_KEY) {
    logger.warn('Invalid API key attempt');
    return res.status(403).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  generateToken,
  apiKeyAuth
};