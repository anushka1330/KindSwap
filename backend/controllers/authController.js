const AuthService = require('../services/authService');

const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE;

const AuthController = {

  // POST /api/auth/register
  register: async (req, res) => {
    try {
      const { email, password, confirmPassword, name, role, state, adminCode } = req.body;

      // Validate admin registration code server-side
      if (role === 'admin') {
        if (!ADMIN_CODE) {
          return res.status(500).json({ error: 'Admin registration is not configured.' });
        }
        if (!adminCode || adminCode !== ADMIN_CODE) {
          return res.status(403).json({ error: 'Invalid admin registration code.' });
        }
      }

      const result = await AuthService.register(
        email, password, confirmPassword, name, role, state
      );

      return res.status(201).json(result);
    } catch (err) {
      console.error('[Auth] Register error:', err.message);
      const status = err.message.includes('already exists') ? 409 : 400;
      return res.status(status).json({ error: err.message });
    }
  },

  // POST /api/auth/verify-otp
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await AuthService.verifyOTP(email, otp);

      // Create session after successful verification
      req.session.user = user;

      return res.status(200).json({
        message: 'Email verified successfully!',
        user
      });
    } catch (err) {
      console.error('[Auth] OTP verify error:', err.message);
      const status = err.message.includes('already verified') ? 409 : 400;
      return res.status(status).json({ error: err.message });
    }
  },

  // POST /api/auth/resend-otp
  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;
      const result = await AuthService.resendOTP(email);
      return res.status(200).json(result);
    } catch (err) {
      console.error('[Auth] Resend OTP error:', err.message);
      return res.status(429).json({ error: err.message });
    }
  },

  // POST /api/auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await AuthService.login(email, password);

      // Create session
      req.session.user = user;

      return res.status(200).json({ user });
    } catch (err) {
      console.error('[Auth] Login error:', err.message);
      if (err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Incorrect email or password.' });
      }
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        return res.status(403).json({
          error: 'Please verify your email before logging in.',
          requiresVerification: true
        });
      }
      // Account locked message is user-safe
      return res.status(401).json({ error: err.message });
    }
  },

  // POST /api/auth/logout
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('[Auth] Logout error:', err.message);
        return res.status(500).json({ error: 'Logout failed.' });
      }
      res.clearCookie('kindswap.sid');
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  },

  // GET /api/auth/me  — restore session on page refresh
  me: (req, res) => {
    if (req.session && req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }
    return res.status(401).json({ user: null });
  }
};

module.exports = AuthController;
