import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidLink, setIsValidLink] = useState(null); // null = checking, true = valid, false = invalid

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash when using email reset
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsValidLink(true);
    } else {
      // Also check for session with type recovery via onAuthStateChange
      supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') setIsValidLink(true);
        else if (isValidLink === null) setIsValidLink(false);
      });
      // Give it a moment to detect
      setTimeout(() => setIsValidLink(v => v === null ? false : v), 1500);
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await resetPassword(form.password);
    setLoading(false);
    if (result.success) setTimeout(() => navigate('/login'), 1500);
    else setErrors({ general: result.error });
  };

  if (isValidLink === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF' }}>
        <div style={{ textAlign: 'center' }}>
          <svg style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 16px' }} width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#E5E7EB" strokeWidth="3"/>
            <path d="M12 2a10 10 0 0110 10" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p style={{ color: '#6B7280' }}>Verifying reset link…</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isValidLink === false) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: 24 }}>
        <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 4px 40px rgba(37,99,235,0.10)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: 12 }}>Link expired or invalid</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6, marginBottom: 28 }}>
            This password reset link may have expired or already been used. Please request a new one.
          </p>
          <Link to="/forgot-password" style={{
            display: 'block', padding: '13px', borderRadius: 12, background: '#2563EB',
            color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 700, marginBottom: 12,
          }}>
            Request New Link
          </Link>
          <Link to="/login" style={{ color: '#6B7280', fontSize: '14px', textDecoration: 'none' }}>Back to Sign In</Link>
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
            <div style={{ width: 56, height: 56, background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#10B981" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: 8 }}>Create new password</h1>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Must be at least 8 characters long.</p>
          </div>

          {errors.general && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {['password', 'confirmPassword'].map(field => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  {field === 'password' ? 'New Password' : 'Confirm Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    name={field}
                    type={showPassword ? 'text' : 'password'}
                    value={form[field]}
                    onChange={e => { setForm(p => ({ ...p, [field]: e.target.value })); if (errors[field]) setErrors(p => ({ ...p, [field]: '' })); }}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '11px 44px 11px 14px', borderRadius: 10,
                      border: `1.5px solid ${errors[field] ? '#EF4444' : '#E5E7EB'}`,
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => !errors[field] && (e.target.style.borderColor = '#2563EB')}
                    onBlur={e => !errors[field] && (e.target.style.borderColor = '#E5E7EB')}
                  />
                  {field === 'password' && (
                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}>
                      {showPassword
                        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                      }
                    </button>
                  )}
                </div>
                {errors[field] && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors[field]}</p>}
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 12, border: 'none',
              background: loading ? '#93C5FD' : '#2563EB', color: '#fff', fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1d4ed8')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#2563EB')}
            >
              {loading && <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>}
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResetPassword;