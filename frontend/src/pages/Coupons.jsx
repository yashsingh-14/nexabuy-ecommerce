import { useEffect, useState } from 'react';
import API from '../api/axios';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', expiry_date: '', usage_limit: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get('/coupons');
      setCoupons(data);
    } catch (err) {
      setError('Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => {
    setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', expiry_date: '', usage_limit: '' });
    setModal({ open: true, mode: 'create', data: null });
    setError('');
  };

  const openEdit = (coupon) => {
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || '',
      expiry_date: coupon.expiry_date ? coupon.expiry_date.split('T')[0] : '',
      usage_limit: coupon.usage_limit || '',
    });
    setModal({ open: true, mode: 'edit', data: coupon });
    setError('');
  };

  const closeModal = () => { setModal({ open: false, mode: 'create', data: null }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (modal.mode === 'create') {
        await API.post('/coupons', form);
        setSuccess('Coupon created successfully!');
      } else {
        await API.put(`/coupons/${modal.data.coupon_id}`, form);
        setSuccess('Coupon updated successfully!');
      }
      closeModal();
      fetchCoupons();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDeactivate = async (coupon) => {
    if (!window.confirm(`Deactivate coupon "${coupon.code}"?`)) return;
    try {
      await API.delete(`/coupons/${coupon.coupon_id}`);
      setSuccess(`Coupon "${coupon.code}" deactivated.`);
      fetchCoupons();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to deactivate coupon.');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Coupon Management 🎟️</h1>
          <p className="page-subtitle">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} created</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Create Coupon</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Expiry</th>
                <th>Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No coupons yet. Create your first one!</td></tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.coupon_id}>
                    <td><strong style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{c.code}</strong></td>
                    <td>
                      <span className="badge badge-primary">
                        {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${parseFloat(c.discount_value).toFixed(0)} OFF`}
                      </span>
                    </td>
                    <td>{c.min_order_amount > 0 ? `₹${parseFloat(c.min_order_amount).toFixed(0)}` : '—'}</td>
                    <td>{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString('en-IN') : 'No Expiry'}</td>
                    <td>{c.times_used}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                    <td>
                      {c.status
                        ? <span className="badge badge-success">Active</span>
                        : <span className="badge badge-danger">Inactive</span>}
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                      {c.status && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(c)}>🗑️</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.mode === 'create' ? '🎟️ Create New Coupon' : '✏️ Edit Coupon'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Coupon Code *</label>
                <input type="text" className="form-control" placeholder="e.g. SAVE20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required style={{ fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount Type *</label>
                  <select className="form-control" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Value *</label>
                  <input type="number" className="form-control" placeholder={form.discount_type === 'percentage' ? 'e.g. 20' : 'e.g. 100'} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} min="0" step="0.01" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Min Order Amount (₹)</label>
                  <input type="number" className="form-control" placeholder="e.g. 500" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input type="date" className="form-control" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Usage Limit (leave empty for unlimited)</label>
                <input type="number" className="form-control" placeholder="e.g. 100" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} min="1" />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modal.mode === 'create' ? 'Create Coupon' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
