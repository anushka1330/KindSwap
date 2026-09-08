const express = require('express');
const router  = express.Router();
const AuthController = require('../controllers/authController');
const {
  loginLimiter,
  registerLimiter,
  otpVerifyLimiter,
  otpResendLimiter
} = require('../middleware/rateLimiter');

router.post('/register',    registerLimiter,   AuthController.register);
router.post('/verify-otp',  otpVerifyLimiter,  AuthController.verifyOTP);
router.post('/resend-otp',  otpResendLimiter,  AuthController.resendOTP);
router.post('/login',       loginLimiter,      AuthController.login);
router.post('/logout',                         AuthController.logout);
router.get('/me',                              AuthController.me);

module.exports = router;
