const express = require('express');
const db = require('../config/db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/orders — user's own orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders.' });
  }
});

// GET /api/orders/all — admin: all orders
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name AS customer_name, u.email FROM orders o
       JOIN users u ON u.user_id = o.user_id ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders.' });
  }
});

// POST /api/orders — place a new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { total_amount, shipping_address } = req.body;
    const [result] = await db.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address, status, created_at) VALUES (?, ?, ?, 'pending', NOW())",
      [req.user.userId, total_amount, shipping_address || '']
    );
    // Clear cart after order
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);
    res.status(201).json({ message: 'Order placed successfully.', orderId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order.' });
  }
});

// PUT /api/orders/:id/status — admin update order status
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status.' });
  }
});

// PUT /api/orders/:id/cancel — cancel an order (customer or admin)
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ message: 'Order not found.' });

    const order = orders[0];
    
    // Check permission: must be the user who placed the order OR an admin
    if (order.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to cancel this order.' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is ${order.status}.` });
    }

    await db.query("UPDATE orders SET status = 'cancelled' WHERE order_id = ?", [req.params.id]);
    res.json({ message: 'Order cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling order.' });
  }
});

module.exports = router;
