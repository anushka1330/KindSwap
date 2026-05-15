const { pool } = require('../config/db');

const AuthQueries = {
  findUserByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  
  findLoginByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM login WHERE email = ?', [email]);
    return rows[0];
  },

  createUser: async (user, password) => {
    const { id, email, role, state } = user;
    // Insert into users
    await pool.query(
      'INSERT INTO users (id, email, role, state) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role), state = VALUES(state)',
      [id, email, role, state]
    );
    
    // Insert into login
    await pool.query(
      'INSERT INTO login (email, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
      [email, password]
    );
    
    return user;
  }
};

module.exports = AuthQueries;
