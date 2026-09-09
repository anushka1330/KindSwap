const { pool } = require('../config/db');

const AuthQueries = {
  // ─── User Queries ─────────────────────────────────────────────────────────

  findUserByKindswapId: async (kindswapId) => {
    if (!kindswapId) return null;
    const [rows] = await pool.query(
      `SELECT u.id, u.kindswap_id, u.password_hash, u.email, u.name, u.age, u.city, u.role, u.state, u.createdAt 
       FROM users u 
       WHERE LOWER(u.kindswap_id) = LOWER(?)`,
      [kindswapId.trim()]
    );
    return rows[0] || null;
  },

  checkKindswapIdExists: async (kindswapId) => {
    if (!kindswapId) return false;
    const [rows] = await pool.query(
      'SELECT u.id FROM users u WHERE LOWER(u.kindswap_id) = LOWER(?)',
      [kindswapId.trim()]
    );
    return rows.length > 0;
  },

  findUserById: async (id) => {
    if (!id) return null;
    const [rows] = await pool.query(
      'SELECT u.id, u.kindswap_id, u.email, u.name, u.age, u.city, u.role, u.state, u.createdAt FROM users u WHERE u.id = ?',
      [id]
    );
    return rows[0] || null;
  },

  findUserByEmail: async (email) => {
    if (!email) return null;
    const [rows] = await pool.query(
      'SELECT u.id, u.kindswap_id, u.email, u.name, u.age, u.city, u.role, u.state, u.createdAt FROM users u WHERE LOWER(u.email) = LOWER(?)',
      [email.trim()]
    );
    return rows[0] || null;
  },

  updateUserProfile: async (id, { name, age, city, state }) => {
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (age !== undefined) {
      fields.push('age = ?');
      values.push(age);
    }
    if (city !== undefined) {
      fields.push('city = ?');
      values.push(city);
    }
    if (state !== undefined) {
      fields.push('state = ?');
      values.push(state);
    }

    if (fields.length === 0) return;
    values.push(id);

    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  createUser: async ({ id, kindswap_id, password_hash, name, role, state, city, email }) => {
    await pool.query(
      `INSERT INTO users (id, kindswap_id, password_hash, name, role, state, city, email) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, kindswap_id, password_hash, name || null, role, state || 'India', city || null, email || null]
    );
  }
};

module.exports = AuthQueries;
