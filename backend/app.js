require('dotenv').config();
const express   = require('express');
const helmet    = require('helmet');
const cors      = require('cors');
const session   = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { pool }  = require('./config/db');

const authRoutes     = require('./routes/authRoutes');
const donationRoutes = require('./routes/donationRoutes');

const app = express();

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS — only allow the Vite dev frontend ─────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,           // allow cookies (session)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Session Store (MySQL) ───────────────────────────────────────────────────
const sessionStore = new MySQLStore({
  createDatabaseTable: false, // table created in db.js initDB
  schema: {
    tableName:    'sessions',
    columnNames: {
      session_id: 'session_id',
      expires:    'expires',
      data:       'data'
    }
  }
}, pool);

app.use(session({
  name:   'kindswap.sid',
  secret: process.env.SESSION_SECRET || 'changeme-use-a-real-secret-in-production',
  store:  sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   parseInt(process.env.SESSION_MAX_AGE_MS) || 24 * 60 * 60 * 1000 // 24h
  }
}));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/donations', donationRoutes);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

module.exports = app;
