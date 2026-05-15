const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const DonationQueries = {
  createDonation: async (donation) => {
    const { id, title, category, state, quantity, donorId, status, date } = donation;
    const q = 'INSERT INTO donations (id, title, category, state, quantity, donorId, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await pool.query(q, [id, title, category, state, quantity, donorId, status, new Date(date)]);
    return donation;
  },

  getAllDonations: async () => {
    const [rows] = await pool.query('SELECT * FROM donations ORDER BY date DESC');
    return rows;
  },

  getDonationsByDonorId: async (donorId) => {
    const [rows] = await pool.query('SELECT * FROM donations WHERE donorId = ? ORDER BY date DESC', [donorId]);
    return rows;
  },

  updateDonationStatus: async (id, status) => {
    const [result] = await pool.query('UPDATE donations SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  requestDonation: async (id, ngoId) => {
    const [result] = await pool.query('UPDATE donations SET status = ?, requestedBy = ? WHERE id = ?', ['Requested', ngoId, id]);
    return result.affectedRows > 0;
  },

  getRequestedDonations: async () => {
    const [rows] = await pool.query('SELECT * FROM donations WHERE status = ? ORDER BY date DESC', ['Requested']);
    return rows;
  },

  adminMatchDonation: async (id) => {
    const [result] = await pool.query('UPDATE donations SET status = ? WHERE id = ?', ['Assigned', id]);
    return result.affectedRows > 0;
  }
};

module.exports = DonationQueries;
