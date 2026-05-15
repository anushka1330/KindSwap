require('dotenv').config();
const app = require('./app');
const { initDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize database then start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server due to database initialization error:', err);
});
