const express = require('express');
const db = require('../config/db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/coupons — Admin: get all coupons ──
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const [coupons] = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching coupons.' });
  }
});

// ── POST /api/coupons — Admin: create new coupon ──
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, expiry_date, usage_limit } = req.body;
    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({ message: 'Code, discount type, and discount value are required.' });
    }
    // Check if code already exists
    const [existing] = await db.query('SELECT coupon_id FROM coupons WHERE code = ?', [code.toUpperCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'A coupon with this code already exists.' });
    }
    const [result] = await db.query(
      'INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expiry_date, usage_limit) VALUES (?, ?, ?, ?, ?, ?)',
      [code.toUpperCase(), discount_type, discount_value, min_order_amount || 0, expiry_date || null, usage_limit || null]
    );
    res.status(201).json({ message: 'Coupon created successfully.', couponId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating coupon.' });
  }
});

// ── PUT /api/coupons/:id — Admin: edit coupon ──
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, expiry_date, usage_limit, status } = req.body;
    await db.query(
      'UPDATE coupons SET code = ?, discount_type = ?, discount_value = ?, min_order_amount = ?, expiry_date = ?, usage_limit = ?, status = ? WHERE coupon_id = ?',
      [code.toUpperCase(), discount_type, discount_value, min_order_amount || 0, expiry_date || null, usage_limit || null, status !== undefined ? status : true, req.params.id]
    );
    res.json({ message: 'Coupon updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating coupon.' });
  }
});

// ── DELETE /api/coupons/:id — Admin: deactivate coupon ──
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await db.query('UPDATE coupons SET status = FALSE WHERE coupon_id = ?', [req.params.id]);
    res.json({ message: 'Coupon deactivated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deactivating coupon.' });
  }
});

// ── POST /api/coupons/validate — Customer: validate and apply coupon ──
router.post('/validate', verifyToken, async (req, res) => {
  try {
    const { code, order_total } = req.body;
    if (!code) return res.status(400).json({ message: 'Please enter a coupon code.' });

    const [coupons] = await db.query('SELECT * FROM coupons WHERE code = ? AND status = TRUE', [code.toUpperCase()]);
    if (coupons.length === 0) {
      return res.status(404).json({ message: 'Invalid or expired coupon code.' });
    }

    const coupon = coupons[0];

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired.' });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit.' });
    }

    // Check minimum order amount
    if (order_total < coupon.min_order_amount) {
      return res.status(400).json({ message: `Minimum order amount of ₹${coupon.min_order_amount} is required for this coupon.` });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (order_total * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }
    // Discount cannot exceed order total
    discount = Math.min(discount, order_total);

    res.json({
      valid: true,
      coupon_id: coupon.coupon_id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: parseFloat(discount.toFixed(2)),
      final_total: parseFloat((order_total - discount).toFixed(2)),
      message: `Coupon applied! You save ₹${discount.toFixed(2)}`
    });
  } catch (err) {
    res.status(500).json({ message: 'Error validating coupon.' });
  }
});

// ── POST /api/coupons/use/:id — increment usage (called after order placed) ──
router.post('/use/:id', verifyToken, async (req, res) => {
  try {
    await db.query('UPDATE coupons SET times_used = times_used + 1 WHERE coupon_id = ?', [req.params.id]);
    res.json({ message: 'Coupon usage recorded.' });
  } catch (err) {
    res.status(500).json({ message: 'Error recording coupon usage.' });
  }
});

module.exports = router;
