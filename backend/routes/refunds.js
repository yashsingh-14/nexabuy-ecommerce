const express = require('express');
const db = require('../config/db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/refunds — Customer: get my refund requests ──
router.get('/', verifyToken, async (req, res) => {
  try {
    const [refunds] = await db.query(
      `SELECT r.*, o.total_amount AS order_total, o.status AS order_status 
       FROM refunds r JOIN orders o ON o.order_id = r.order_id 
       WHERE r.user_id = ? ORDER BY r.created_at DESC`,
      [req.user.userId]
    );
    res.json(refunds);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching refunds.' });
  }
});

// ── GET /api/refunds/all — Admin: get all refund requests ──
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const [refunds] = await db.query(
      `SELECT r.*, o.total_amount AS order_total, o.status AS order_status, u.name AS customer_name, u.email 
       FROM refunds r 
       JOIN orders o ON o.order_id = r.order_id 
       JOIN users u ON u.user_id = r.user_id 
       ORDER BY r.created_at DESC`
    );
    res.json(refunds);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching refunds.' });
  }
});

// ── POST /api/refunds — Customer: submit a refund request ──
router.post('/', verifyToken, async (req, res) => {
  try {
    const { order_id, reason } = req.body;
    if (!order_id || !reason) {
      return res.status(400).json({ message: 'Order ID and reason are required.' });
    }

    // Verify order belongs to this user
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [order_id, req.user.userId]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = orders[0];

    // Only allow refund for delivered or cancelled orders
    if (!['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Refund can only be requested for delivered or cancelled orders.' });
    }

    // Check if refund already requested
    const [existing] = await db.query(
      'SELECT refund_id FROM refunds WHERE order_id = ? AND user_id = ?',
      [order_id, req.user.userId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'A refund request for this order already exists.' });
    }

    const [result] = await db.query(
      'INSERT INTO refunds (order_id, user_id, reason, amount) VALUES (?, ?, ?, ?)',
      [order_id, req.user.userId, reason, order.total_amount]
    );

    res.status(201).json({ message: 'Refund request submitted successfully.', refundId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting refund request.' });
  }
});

// ── PUT /api/refunds/:id/status — Admin: approve or reject refund ──
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected.' });
    }

    await db.query(
      'UPDATE refunds SET status = ?, admin_note = ?, resolved_at = NOW() WHERE refund_id = ?',
      [status, admin_note || null, req.params.id]
    );

    // If approved, update payment status to refunded
    if (status === 'approved') {
      const [refunds] = await db.query('SELECT order_id FROM refunds WHERE refund_id = ?', [req.params.id]);
      if (refunds.length > 0) {
        await db.query("UPDATE payment SET status = 'failed' WHERE order_id = ?", [refunds[0].order_id]);
        await db.query("UPDATE orders SET status = 'cancelled' WHERE order_id = ?", [refunds[0].order_id]);
      }
    }

    res.json({ message: `Refund ${status} successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating refund status.' });
  }
});

module.exports = router;
