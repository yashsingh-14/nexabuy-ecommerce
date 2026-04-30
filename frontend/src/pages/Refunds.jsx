import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Refunds = () => {
  const { isAdmin } = useAuth();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchRefunds = async () => {
    try {
      const { data } = await API.get(isAdmin() ? '/refunds/all' : '/refunds');
      setRefunds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRefunds(); }, []);

  const handleAction = async (refundId, status) => {
    const note = status === 'rejected' ? prompt('Reason for rejection (optional):') : null;
    try {
      await API.put(`/refunds/${refundId}/status`, { status, admin_note: note || '' });
      setSuccess(`Refund ${status} successfully.`);
      fetchRefunds();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update refund.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
    return <span className={`badge ${map[status] || 'badge-primary'}`}>{status}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin() ? 'Refund Management 💰' : 'My Refund Requests 💰'}</h1>
          <p className="page-subtitle">{isAdmin() ? 'Review and process customer refund requests' : 'Track the status of your refund requests'}</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {refunds.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <p>{isAdmin() ? 'No refund requests yet.' : 'You have not submitted any refund requests.'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Order ID</th>
                  {isAdmin() && <th>Customer</th>}
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r.refund_id}>
                    <td><strong>#{r.refund_id}</strong></td>
                    <td><strong>#{r.order_id}</strong></td>
                    {isAdmin() && (
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.customer_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.email}</div>
                      </td>
                    )}
                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{parseFloat(r.amount).toFixed(2)}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td>{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                    {isAdmin() && (
                      <td>
                        {r.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-sm" style={{ background: 'var(--success)', color: 'white', padding: '0.2rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleAction(r.refund_id, 'approved')}>✓ Approve</button>
                            <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleAction(r.refund_id, 'rejected')}>✗ Reject</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {r.admin_note ? `Note: ${r.admin_note}` : 'Resolved'}
                          </span>
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
    </div>
  );
};

export default Refunds;
