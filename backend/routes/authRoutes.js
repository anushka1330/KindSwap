const express = require('express');
const router  = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const {
  loginLimiter,
  registerLimiter,
  checkIdLimiter
} = require('../middleware/rateLimiter');

// Real-time KindSwap ID availability check
router.get('/check-id', checkIdLimiter, AuthController.checkId);

// Core authentication routes
router.post('/register', registerLimiter, AuthController.register);
router.post('/login',    loginLimiter,    AuthController.login);
router.post('/logout',                    AuthController.logout);
router.get('/me',                         AuthController.me);
router.put('/profile',   requireAuth,     AuthController.updateProfile);

module.exports = router;
