const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/refunds', require('./routes/refunds'));

const path = require('path');

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Health check (API)
app.get('/api/health', (req, res) => {
  res.json({ message: 'NexaBuy API Server is running!' });
});

// AFTER defining all API routes, catch-all route to serve the React app
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

// Auto-create new tables if they don't exist (safe for production)
const db = require('./config/db');
async function runMigrations() {
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS coupons (
      coupon_id INT PRIMARY KEY AUTO_INCREMENT, code VARCHAR(50) NOT NULL UNIQUE,
      discount_type ENUM('percentage','flat') NOT NULL, discount_value DECIMAL(10,2) NOT NULL,
      min_order_amount DECIMAL(10,2) DEFAULT 0, expiry_date DATE, usage_limit INT DEFAULT NULL,
      times_used INT DEFAULT 0, status BOOLEAN DEFAULT TRUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS refunds (
      refund_id INT PRIMARY KEY AUTO_INCREMENT, order_id INT NOT NULL, user_id INT NOT NULL,
      reason VARCHAR(500) NOT NULL, amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending','approved','rejected') DEFAULT 'pending', admin_note VARCHAR(300),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, resolved_at DATETIME,
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )`);
    console.log('✅ Database tables verified.');
  } catch (err) {
    console.error('⚠️  Migration warning:', err.message);
  }
}

app.listen(PORT, async () => {
  await runMigrations();
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
