import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { authModalState, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState(authModalState.tab || 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalState.isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail, userPass) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await login(userEmail, userPass);
    } catch (err) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="veloop-modal-backdrop" onClick={closeAuthModal}>
      <div
        className="veloop-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px' }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '10px',
              borderRadius: '50%',
              background: 'rgba(255, 107, 74, 0.15)',
              border: '1px solid rgba(255, 107, 74, 0.3)',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={28} color="#FF6B4A" />
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
            {tab === 'login' ? 'Sign In to VELOOP' : 'Create VELOOP Account'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
            {tab === 'login'
              ? 'Access your rewards wallet & join premium giveaways'
              : 'Join today and receive instant welcome bonus tokens'}
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(33, 19, 38, 0.9)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '20px',
            border: '1px solid rgba(246, 200, 95, 0.15)',
          }}
        >
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: tab === 'login' ? 'var(--grad-coral)' : 'transparent',
              color: tab === 'login' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: tab === 'register' ? 'var(--grad-coral)' : 'transparent',
              color: tab === 'register' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(255, 107, 74, 0.12)',
              border: '1px solid rgba(255, 107, 74, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              color: '#FF876D',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'register' && (
            <div className="veloop-input-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  className="veloop-input"
                  style={{ paddingLeft: '40px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <UserIcon
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          )}

          <div className="veloop-input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="veloop-input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="veloop-input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="veloop-input"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-veloop-primary"
            style={{ width: '100%', marginTop: '8px', padding: '13px' }}
          >
            {isLoading
              ? 'Verifying...'
              : tab === 'login'
              ? 'Sign In to Account'
              : 'Claim Welcome Bonus & Register'}
          </button>
        </form>

        {/* Quick Demo Logins for immediate testing */}
        <div style={{ marginTop: '22px', borderTop: '1px solid rgba(246, 200, 95, 0.15)', paddingTop: '16px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
            DEMO TEST ACCOUNTS (Instant One-Click Login):
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@veloop.com', 'User@123456')}
              className="btn-veloop-outline"
              style={{ fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'space-between' }}
            >
              <span>Alex Vance (Demo User)</span>
              <span className="badge-veloop-gold" style={{ fontSize: '0.7rem' }}>
                1500 VEs • 1000 SVEs
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('sarah@veloop.com', 'User@123456')}
              className="btn-veloop-outline"
              style={{ fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'space-between' }}
            >
              <span>Sarah Connor (Low Balance Test)</span>
              <span className="badge-veloop-coral" style={{ fontSize: '0.7rem' }}>
                50 VEs (Deficit Test)
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@veloop.com', 'Admin@123456')}
              className="btn-veloop-outline"
              style={{ fontSize: '0.8rem', padding: '8px 12px', justifyContent: 'space-between' }}
            >
              <span>VELOOP Admin</span>
              <span className="badge-veloop-emerald" style={{ fontSize: '0.7rem' }}>
                Admin Portal Access
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
