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
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
