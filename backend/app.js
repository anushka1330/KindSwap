const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

module.exports = app;
