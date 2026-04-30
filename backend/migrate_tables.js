// Run this with: node migrate_tables.js
// Creates the coupons and refunds tables in whatever DB is configured in .env

require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const isLocal = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';
  
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  };
  if (!isLocal) {
    config.ssl = { rejectUnauthorized: false };
  }

  console.log(`🔗 Connecting to ${process.env.DB_HOST}:${config.port}...`);
  const connection = await mysql.createConnection(config);
  console.log('✅ Connected!\n');

  // Create coupons table
  console.log('📦 Creating coupons table...');
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      coupon_id      INT PRIMARY KEY AUTO_INCREMENT,
      code           VARCHAR(50) NOT NULL UNIQUE,
      discount_type  ENUM('percentage', 'flat') NOT NULL,
      discount_value DECIMAL(10,2) NOT NULL,
      min_order_amount DECIMAL(10,2) DEFAULT 0,
      expiry_date    DATE,
      usage_limit    INT DEFAULT NULL,
      times_used     INT DEFAULT 0,
      status         BOOLEAN DEFAULT TRUE,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Coupons table ready!\n');

  // Create refunds table
  console.log('📦 Creating refunds table...');
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS refunds (
      refund_id    INT PRIMARY KEY AUTO_INCREMENT,
      order_id     INT NOT NULL,
      user_id      INT NOT NULL,
      reason       VARCHAR(500) NOT NULL,
      amount       DECIMAL(10,2) NOT NULL,
      status       ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      admin_note   VARCHAR(300),
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved_at  DATETIME,
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Refunds table ready!\n');

  console.log('🎉 Migration complete! Both tables are now in your database.');
  await connection.end();
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
