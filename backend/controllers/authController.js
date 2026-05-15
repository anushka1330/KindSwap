const AuthService = require('../services/authService');

const AuthController = {
  login: async (req, res) => {
    try {
      const { email, role, state, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const user = await AuthService.loginOrRegister(email, role, state, password);
      res.status(200).json(user);
    } catch (error) {
      if (error.message === 'INVALID_PASSWORD') {
        return res.status(401).json({ error: 'Incorrect password' });
      }
      if (error.message === 'MISSING_REGISTRATION_FIELDS') {
        return res.status(400).json({ error: 'User not found. Please provide Role and State to sign up.' });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  }
};

module.exports = AuthController;
