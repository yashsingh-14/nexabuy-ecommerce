const mysql = require('mysql2');
require('dotenv').config();

const isLocal = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Only use SSL for cloud databases (Aiven, etc.)
if (!isLocal) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

const db = pool.promise();

module.exports = db;
