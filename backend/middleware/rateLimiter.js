const rateLimit = require('express-rate-limit');

// Shared handler for consistent error format
const handler = (req, res) => {
  res.status(429).json({
    error: 'Too many requests. Please wait a moment and try again.'
  });
};

/**
 * Login: 10 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

/**
 * Registration: 5 accounts per hour per IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

/**
 * OTP verification: 10 attempts per 15 minutes per IP
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

/**
 * OTP resend: 5 requests per 10 minutes per IP
 */
const otpResendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler
});

module.exports = { loginLimiter, registerLimiter, otpVerifyLimiter, otpResendLimiter };
