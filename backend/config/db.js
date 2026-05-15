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

const initDB = async () => {
  try {
    // First connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'kindswap'}\`;`);
    await connection.end();

    // Now initialize tables in the database
    console.log('Database connected successfully. Initializing tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        state VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        quantity INT DEFAULT 1,
        donorId VARCHAR(255) NOT NULL,
        requestedBy VARCHAR(255) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'Available',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donorId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS login (
        email VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
      );
    `);

    console.log('Tables initialized successfully.');
    
    // Ensure requestedBy exists if the table was already created
    try {
      await pool.query('ALTER TABLE donations ADD COLUMN requestedBy VARCHAR(255) DEFAULT NULL');
      console.log('Added requestedBy column to donations table');
    } catch (e) {
      // Column might already exist
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding requestedBy column:', e.message);
      }
    }

  } catch (error) {
    console.error('Database connection or initialization failed:', error.message);
    console.error('Please ensure MySQL Workbench is running locally with the correct credentials.');
  }
};

module.exports = { pool, initDB };
