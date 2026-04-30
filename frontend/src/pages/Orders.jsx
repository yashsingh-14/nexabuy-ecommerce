import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Orders = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundModal, setRefundModal] = useState({ open: false, order: null });
  const [refundReason, setRefundReason] = useState('');
  const [refundLoading, setRefundLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchOrders = () => {
    API.get(isAdmin() ? '/orders/all' : '/orders')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleRefundSubmit = async () => {
    if (!refundReason.trim()) return;
    setRefundLoading(true);
    try {
      await API.post('/refunds', { order_id: refundModal.order.order_id, reason: refundReason });
      setMsg('Refund request submitted successfully! You can track it from the Refunds page.');
      setRefundModal({ open: false, order: null });
      setRefundReason('');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to submit refund request.');
      setTimeout(() => setMsg(''), 4000);
    } finally {
      setRefundLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'badge-warning',
      confirmed: 'badge-primary',
      shipped: 'badge-info',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    return <span className={`badge ${map[status] || 'badge-primary'}`}>{status}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin() ? 'Global Orders Management' : 'My Orders'}</h1>
          <p className="page-subtitle">{isAdmin() ? 'Track and update all customer shipments' : 'Track all your personal orders here'}</p>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>{isAdmin() ? 'No orders have been placed on your platform yet.' : 'No orders placed yet. Start shopping!'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  {isAdmin() && <th>Customer</th>}
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date Placed</th>
                  {!isAdmin() && <th>Refund</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td><strong>#{order.order_id}</strong></td>
                    {isAdmin() && (
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.email}</div>
                      </td>
                    )}
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td>
                      {isAdmin() ? (
                        <select 
                          className={`badge ${
                            order.status === 'pending' ? 'badge-warning' : 
                            order.status === 'confirmed' ? 'badge-primary' : 
                            order.status === 'shipped' ? 'badge-info' : 
                            order.status === 'delivered' ? 'badge-success' : 
                            'badge-danger'
                          }`}
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                          style={{ 
                            padding: '0.4rem 1.5rem 0.4rem 0.8rem', 
                            fontSize: '0.75rem', 
                            cursor: 'pointer',
                            border: '1px solid currentColor',
                            outline: 'none',
                            textTransform: 'uppercase',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : statusBadge(order.status)}
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    {!isAdmin() && (
                      <td>
                        {['delivered', 'cancelled'].includes(order.status) ? (
                          <button
                            className="btn btn-sm"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
                            onClick={() => setRefundModal({ open: true, order })}
                          >
                            💰 Request Refund
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refund Request Modal */}
      {refundModal.open && (
        <div className="modal-overlay" onClick={() => setRefundModal({ open: false, order: null })}>
          <div className="modal" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">💰 Request Refund</h3>
              <button className="modal-close" onClick={() => setRefundModal({ open: false, order: null })}>×</button>
            </div>

            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Order</span>
                <strong>#{refundModal.order?.order_id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Amount</span>
                <strong style={{ color: 'var(--primary)' }}>₹{parseFloat(refundModal.order?.total_amount).toFixed(2)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Refund *</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Please explain why you want a refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setRefundModal({ open: false, order: null })}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRefundSubmit} disabled={refundLoading || !refundReason.trim()}>
                {refundLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
