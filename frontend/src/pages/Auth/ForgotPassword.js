import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) setSent(true);
    else setError(result.error);
  };

  if (sent) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: 24 }}>
        <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 4px 40px rgba(37,99,235,0.10)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="#2563EB" strokeWidth="2"/>
              <path d="M22 6l-10 7L2 6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: 12 }}>Email sent!</h2>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.6, marginBottom: 8 }}>We've sent a password reset link to</p>
          <p style={{ color: '#2563EB', fontWeight: 700, marginBottom: 24 }}>{email}</p>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: 32 }}>Didn't receive it? Check spam or try again.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => setSent(false)} style={{
              padding: '12px', borderRadius: 12, border: '1.5px solid #E5E7EB',
              background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}>
              Try again
            </button>
            <Link to="/login" style={{
              display: 'block', padding: '12px', borderRadius: 12, background: '#2563EB',
              color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700,
            }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, background: '#2563EB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB' }}>Raiser</span>
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: 24, padding: '40px', boxShadow: '0 4px 40px rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#2563EB" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Forgot password?</h1>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>No worries — we'll send you a reset link.</p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com" autoComplete="email"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: `1.5px solid ${error ? '#EF4444' : '#E5E7EB'}`,
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => !error && (e.target.style.borderColor = '#2563EB')}
                onBlur={e => !error && (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 12, border: 'none',
              background: loading ? '#93C5FD' : '#2563EB', color: '#fff', fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#2563EB')}
            >
              {loading && <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>}
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', marginTop: 24, marginBottom: 0 }}>
            Remembered it?{' '}
            <Link to="/login" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ForgotPassword;