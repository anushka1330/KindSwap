const AuthQueries = require('../queries/authQueries');

const AuthService = {
  loginOrRegister: async (email, role, state, password) => {
    // Check if user has a login entry
    const existingLogin = await AuthQueries.findLoginByEmail(email);
    
    if (existingLogin) {
      // User exists, verify password (using simple text comparison for now)
      if (existingLogin.password !== password) {
        throw new Error('INVALID_PASSWORD');
      }
      // Password is correct, return existing user
      return await AuthQueries.findUserByEmail(email);
    } else {
      // New user, register them
      if (!role || !state) {
        throw new Error('MISSING_REGISTRATION_FIELDS');
      }
      const user = {
        id: email, // Using email as ID for simplicity
        email,
        role,
        state
      };
      
      await AuthQueries.createUser(user, password);
      return await AuthQueries.findUserByEmail(email);
    }
  }
};

module.exports = AuthService;
