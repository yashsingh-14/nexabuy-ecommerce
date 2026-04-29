import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnimatedNavFramer } from './AnimatedNavFramer';

const Layout = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Note: The logout logic is inside AnimatedNavFramer, but we'll keep the modal state if needed
  // Since AnimatedNavFramer calls logout() directly, the modal won't show.
  // To use the modal, AnimatedNavFramer would need to emit an event or we can just let it logout directly.

  return (
    <div className="app-layout">
      {/* Animated Navigation Menu */}
      <AnimatedNavFramer />

      {/* Page Content */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal (Not currently triggered by new nav, kept for fallback) */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)} role="dialog" aria-modal="true" aria-labelledby="logout-title" style={{ zIndex: 9999 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '350px', textAlign: 'center', padding: '2rem', borderTop: '4px solid var(--danger)' }}>
            {isAdmin() ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
                <h3 id="logout-title" style={{ marginBottom: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>End Admin Session?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: '1.5' }}>Are you sure you want to securely log out of the NexaBuy Administrative Console?</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👋</div>
                <h3 id="logout-title" style={{ marginBottom: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Leaving so soon?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: '1.5' }}>Are you sure you want to log out of your NexaBuy account?</p>
              </>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { logout(); navigate('/login'); }} style={{ flex: 1, justifyContent: 'center' }}>Yes, Log Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
