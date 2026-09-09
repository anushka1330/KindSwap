const AuthService = require('../services/authService');
const AuthQueries = require('../queries/authQueries');

const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE;

const AuthController = {

  // GET /api/auth/check-id?kindswapId=...
  checkId: async (req, res) => {
    try {
      const { kindswapId } = req.query;
      const result = await AuthService.checkIdAvailability(kindswapId);
      return res.status(200).json(result);
    } catch (err) {
      console.error('[Auth] Check ID error:', err.message);
      return res.status(400).json({ available: false, message: err.message });
    }
  },

  // POST /api/auth/register (Page 1: Create KindSwap ID & Password)
  register: async (req, res) => {
    try {
      const { kindswapId, password, confirmPassword, role, state, adminCode } = req.body;

      // Validate admin registration code server-side
      if (role === 'admin') {
        if (!ADMIN_CODE) {
          return res.status(500).json({ error: 'Admin registration is not configured.' });
        }
        if (!adminCode || adminCode !== ADMIN_CODE) {
          return res.status(403).json({ error: 'Invalid admin registration code.' });
        }
      }

      const user = await AuthService.register({
        kindswapId,
        password,
        confirmPassword,
        role: role || 'donor',
        state: state || 'India'
      });

      // Automatically establish session for seamless transition to Page 2
      req.session.user = user;

      return res.status(201).json({
        message: 'KindSwap ID created successfully!',
        user
      });
    } catch (err) {
      console.error('[Auth] Register error:', err.message);
      const status = err.message.includes('already taken') ? 409 : 400;
      return res.status(status).json({ error: err.message });
    }
  },

  // POST /api/auth/login (KindSwap ID + Password)
  login: async (req, res) => {
    try {
      const { kindswapId, password } = req.body;
      const user = await AuthService.login(kindswapId, password);

      // Create session
      req.session.user = user;

      return res.status(200).json({ user });
    } catch (err) {
      console.error('[Auth] Login error:', err.message);
      if (err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Incorrect KindSwap ID or password.' });
      }
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

  // PUT /api/auth/profile (Page 2: Tell us about yourself)
  updateProfile: async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Authentication required.' });
      }
      const { name, age, city, state } = req.body;
      const updatedUser = await AuthService.updateProfile(req.session.user.id, {
        name,
        age,
        city,
        state
      });

      // Keep session updated
      req.session.user = updatedUser;

      return res.status(200).json({
        message: 'Profile updated successfully.',
        user: updatedUser
      });
    } catch (err) {
      console.error('[Auth] Update profile error:', err.message);
      return res.status(400).json({ error: err.message });
    }
  },

  // GET /api/auth/me — restore session on page refresh
  me: async (req, res) => {
    if (req.session && req.session.user) {
      try {
        const freshUser = await AuthQueries.findUserById(req.session.user.id);
        if (freshUser) {
          req.session.user = {
            id: freshUser.id,
            kindswap_id: freshUser.kindswap_id,
            email: freshUser.email,
            name: freshUser.name,
            age: freshUser.age,
            city: freshUser.city,
            role: freshUser.role,
            state: freshUser.state
          };
          return res.status(200).json({ user: req.session.user });
        }
      } catch (e) {
        return res.status(200).json({ user: req.session.user });
      }
    }
    return res.status(401).json({ user: null });
  }
};

module.exports = AuthController;
