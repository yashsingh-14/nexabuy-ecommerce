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

  console.log('📦 Altering products table...');
  try {
    // We execute these one by one to avoid syntax errors with multiple statements
    await connection.execute(`ALTER TABLE products CHANGE name product_name VARCHAR(150) NOT NULL`);
    console.log('✅ Renamed name to product_name');
  } catch (e) { console.log('⚠️ ' + e.message); }

  try {
    await connection.execute(`ALTER TABLE products MODIFY description VARCHAR(500)`);
    console.log('✅ Modified description to VARCHAR(500)');
  } catch (e) { console.log('⚠️ ' + e.message); }

  try {
    await connection.execute(`ALTER TABLE products CHANGE stock inventory_count INT DEFAULT 0`);
    console.log('✅ Renamed stock to inventory_count');
  } catch (e) { console.log('⚠️ ' + e.message); }

  try {
    await connection.execute(`ALTER TABLE products ADD COLUMN SKU VARCHAR(50)`);
    console.log('✅ Added SKU column');
  } catch (e) { console.log('⚠️ ' + e.message); }

  try {
    await connection.execute(`ALTER TABLE products ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    console.log('✅ Added updated_at column');
  } catch (e) { console.log('⚠️ ' + e.message); }

  console.log('🎉 Product Migration complete!');
  await connection.end();
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
