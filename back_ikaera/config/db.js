// config/db.js
const { Pool } = require('pg'); // PostgreSQL client
require('dotenv').config(); // Load environment variables

// Create a new Pool instance for PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER , 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

// Export the pool
module.exports = pool;
