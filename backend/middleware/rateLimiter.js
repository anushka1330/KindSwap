const rateLimit = require('express-rate-limit');

// Shared handler for consistent error format
const handler = (req, res) => {
  res.status(429).json({
    error: 'Too many requests. Please wait a moment and try again.'
  });
};

/**
 * Login: 20 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

/**
 * Registration: 20 accounts per hour per IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

/**
 * KindSwap ID check: 60 queries per minute per IP
 */
const checkIdLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

module.exports = { loginLimiter, registerLimiter, checkIdLimiter };
