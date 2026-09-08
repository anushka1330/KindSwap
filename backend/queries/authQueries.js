const { pool } = require('../config/db');

const AuthQueries = {
  // ─── User Queries ─────────────────────────────────────────────────────────

  findUserByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT u.id, u.email, u.name, u.role, u.state, u.createdAt FROM users u WHERE u.email = ?',
      [email]
    );
    return rows[0] || null;
  },

  findLoginByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT email, password_hash, email_verified, failed_attempts, locked_until, last_otp_sent_at FROM login WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  createUser: async ({ id, email, name, role, state }) => {
    await pool.query(
      'INSERT INTO users (id, email, name, role, state) VALUES (?, ?, ?, ?, ?)',
      [id, email, name || null, role, state]
    );
  },

  createLogin: async (email, passwordHash) => {
    await pool.query(
      'INSERT INTO login (email, password_hash, email_verified) VALUES (?, ?, 0)',
      [email, passwordHash]
    );
  },

  setEmailVerified: async (email) => {
    await pool.query(
      'UPDATE login SET email_verified = 1 WHERE email = ?',
      [email]
    );
  },

  updateFailedAttempts: async (email, count) => {
    await pool.query(
      'UPDATE login SET failed_attempts = ? WHERE email = ?',
      [count, email]
    );
  },

  lockAccount: async (email, lockedUntil) => {
    await pool.query(
      'UPDATE login SET locked_until = ?, failed_attempts = ? WHERE email = ?',
      [lockedUntil, 0, email]
    );
  },

  resetFailedAttempts: async (email) => {
    await pool.query(
      'UPDATE login SET failed_attempts = 0, locked_until = NULL WHERE email = ?',
      [email]
    );
  },

  updateLastOTPSentAt: async (email, sentAt) => {
    await pool.query(
      'UPDATE login SET last_otp_sent_at = ? WHERE email = ?',
      [sentAt, email]
    );
  },

  // ─── OTP Queries ──────────────────────────────────────────────────────────

  /**
   * Insert a new OTP record. Raw OTP is NOT stored — only a bcrypt hash.
   */
  createOTP: async ({ email, otpHash, purpose, expiresAt, maxAttempts }) => {
    const [result] = await pool.query(
      `INSERT INTO email_verifications
         (email, otp_hash, purpose, expires_at, attempts, max_attempts)
       VALUES (?, ?, ?, ?, 0, ?)`,
      [email, otpHash, purpose || 'registration', expiresAt, maxAttempts || 5]
    );
    return result.insertId;
  },

  /**
   * Retrieve the latest valid (unused, not invalidated, not expired) OTP for an email.
   */
  findActiveOTP: async (email, purpose) => {
    const [rows] = await pool.query(
      `SELECT * FROM email_verifications
       WHERE email = ?
         AND purpose = ?
         AND used_at IS NULL
         AND invalidated_at IS NULL
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, purpose || 'registration']
    );
    return rows[0] || null;
  },

  incrementOTPAttempts: async (id) => {
    await pool.query(
      'UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?',
      [id]
    );
  },

  markOTPUsed: async (id) => {
    await pool.query(
      'UPDATE email_verifications SET used_at = NOW() WHERE id = ?',
      [id]
    );
  },

  invalidateOTPsByEmail: async (email, purpose) => {
    await pool.query(
      `UPDATE email_verifications
       SET invalidated_at = NOW()
       WHERE email = ?
         AND purpose = ?
         AND used_at IS NULL
         AND invalidated_at IS NULL`,
      [email, purpose || 'registration']
    );
  }
};

module.exports = AuthQueries;
