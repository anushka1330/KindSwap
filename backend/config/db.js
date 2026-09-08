require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'kindswap',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Safely add a column if it doesn't already exist
async function safeAddColumn(tableName, columnName, columnDef) {
  try {
    await pool.query(`ALTER TABLE \`${tableName}\` ADD COLUMN ${columnName} ${columnDef}`);
    console.log(`  [migration] Added column '${columnName}' to '${tableName}'.`);
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      // Column already exists — skip silently
    } else {
      console.error(`  [migration] Error adding column '${columnName}' to '${tableName}':`, e.message);
    }
  }
}

const initDB = async () => {
  try {
    // --- Step 1: Create database if it doesn't exist ---
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234'
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'kindswap'}\`;`
    );
    await connection.end();

    console.log('Database connected. Running migrations...');

    // --- Step 2: Core tables (CREATE IF NOT EXISTS is safe) ---

    // users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id        VARCHAR(255) PRIMARY KEY,
        email     VARCHAR(255) UNIQUE NOT NULL,
        name      VARCHAR(255) DEFAULT NULL,
        role      VARCHAR(50)  NOT NULL,
        state     VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // login table (secure version)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login (
        email         VARCHAR(255) PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL DEFAULT '',
        email_verified TINYINT(1)  NOT NULL DEFAULT 0,
        failed_attempts INT        NOT NULL DEFAULT 0,
        locked_until  DATETIME    DEFAULT NULL,
        last_otp_sent_at DATETIME  DEFAULT NULL,
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
      );
    `);

    // donations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id          VARCHAR(255) PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        category    VARCHAR(100) NOT NULL,
        state       VARCHAR(100) NOT NULL,
        quantity    INT          DEFAULT 1,
        donorId     VARCHAR(255) NOT NULL,
        requestedBy VARCHAR(255) DEFAULT NULL,
        status      VARCHAR(50)  DEFAULT 'Available',
        date        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donorId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // email_verifications table (OTP)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        email          VARCHAR(255) NOT NULL,
        otp_hash       VARCHAR(255) NOT NULL,
        purpose        VARCHAR(50)  NOT NULL DEFAULT 'registration',
        expires_at     DATETIME     NOT NULL,
        attempts       INT          NOT NULL DEFAULT 0,
        max_attempts   INT          NOT NULL DEFAULT 5,
        used_at        DATETIME     DEFAULT NULL,
        invalidated_at DATETIME     DEFAULT NULL,
        created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ev_email   (email),
        INDEX idx_ev_expires (expires_at)
      );
    `);

    // sessions table (for express-mysql-session)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id  VARCHAR(128)  NOT NULL,
        expires     INT(11)       UNSIGNED NOT NULL,
        data        MEDIUMTEXT,
        PRIMARY KEY (session_id)
      );
    `);

    console.log('Core tables ready.');

    // --- Step 3: Safe column additions (idempotent migrations) ---

    // Add 'name' to users if missing (legacy tables won't have it)
    await safeAddColumn('users', 'name', "VARCHAR(255) DEFAULT NULL AFTER email");

    // Add secure columns to login if this was an old plaintext table
    await safeAddColumn('login', 'password_hash', "VARCHAR(255) NOT NULL DEFAULT '' AFTER email");
    await safeAddColumn('login', 'email_verified', "TINYINT(1) NOT NULL DEFAULT 0");
    await safeAddColumn('login', 'failed_attempts', "INT NOT NULL DEFAULT 0");
    await safeAddColumn('login', 'locked_until', "DATETIME DEFAULT NULL");
    await safeAddColumn('login', 'last_otp_sent_at', "DATETIME DEFAULT NULL");

    // Ensure requestedBy exists on donations
    await safeAddColumn('donations', 'requestedBy', "VARCHAR(255) DEFAULT NULL");

    // ── Legacy migration: make old plaintext 'password' column nullable ──────
    // Old table had: password VARCHAR(255) NOT NULL
    // This blocks new inserts that only set password_hash.
    // We make it nullable (or give it a default) so inserts work.
    try {
      await pool.query(
        "ALTER TABLE login MODIFY COLUMN password VARCHAR(255) NULL DEFAULT NULL"
      );
      console.log("  [migration] Made legacy 'password' column nullable.");
    } catch (e) {
      if (e.code !== 'ER_BAD_FIELD_ERROR') {
        // Column might not exist at all (fresh install) — that's fine
        if (!e.message.includes("Unknown column")) {
          console.error('  [migration] Note on legacy password column:', e.message);
        }
      }
    }

    console.log('Migrations complete. Server ready.');

  } catch (error) {
    console.error('Database initialization failed:', error.message);
    console.error('Ensure MySQL is running with correct credentials in .env');
    process.exit(1);
  }
};

module.exports = { pool, initDB };
