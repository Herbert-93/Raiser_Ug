import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await login(form);
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
    else setErrors({ general: result.error });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F0F4FF' }}>
      {/* Left Panel – Decorative */}
      <div style={{
        display: 'none',
        flex: 1,
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
        position: 'relative',
        overflow: 'hidden',
      }} className="login-left-panel">
        {/* Pattern circles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.15)',
            width: `${120 + i * 80}px`,
            height: `${120 + i * 80}px`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 10, padding: '60px', color: '#fff', marginTop: 'auto', paddingBottom: '80px' }}>
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.2)', borderRadius: 16, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            Uganda's Most Trusted<br />Fundraising Platform
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: 1.6 }}>
            Join thousands of Ugandans raising funds for causes that matter — medical, education, community, and more.
          </p>
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { num: 'UGX 2.5B+', label: 'Raised' },
              { num: '500+', label: 'Campaigns' },
              { num: '10K+', label: 'Donors' },
              { num: '200+', label: 'Communities' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: '#F0F4FF',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 44, height: 44, background: '#2563EB', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB' }}>Raiser</span>
            </Link>
          </div>

          {/* Card */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: '40px 40px',
            boxShadow: '0 4px 40px rgba(37,99,235,0.10)',
            border: '1px solid rgba(37,99,235,0.08)',
          }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', marginBottom: 8, textAlign: 'center' }}>
              Welcome back
            </h1>
            <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: 28 }}>
              Sign in to continue to your Raiser account
            </p>

            {/* Google Sign In */}
            <button
              onClick={loginWithGoogle}
              type="button"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, padding: '11px 0', borderRadius: 12, border: '1.5px solid #E5E7EB',
                background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                color: '#374151', marginBottom: 24, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#F0F4FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>or sign in with email</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>

            {/* General Error */}
            {errors.general && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
                padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  name="email" type="email" value={form.email}
                  onChange={handleChange} autoComplete="email"
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: `1.5px solid ${errors.email ? '#EF4444' : '#E5E7EB'}`,
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    background: errors.email ? '#FEF2F2' : '#fff',
                  }}
                  onFocus={e => !errors.email && (e.target.style.borderColor = '#2563EB')}
                  onBlur={e => !errors.email && (e.target.style.borderColor = '#E5E7EB')}
                />
                {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    name="password" type={showPassword ? 'text' : 'password'}
                    value={form.password} onChange={handleChange} autoComplete="current-password"
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '11px 44px 11px 14px', borderRadius: 10,
                      border: `1.5px solid ${errors.password ? '#EF4444' : '#E5E7EB'}`,
                      fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                      background: errors.password ? '#FEF2F2' : '#fff',
                    }}
                    onFocus={e => !errors.password && (e.target.style.borderColor = '#2563EB')}
                    onBlur={e => !errors.password && (e.target.style.borderColor = '#E5E7EB')}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
                  }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                  background: loading ? '#93C5FD' : '#2563EB', color: '#fff',
                  fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginTop: 4,
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={e => !loading && (e.currentTarget.style.background = '#2563EB')}
              >
                {loading && (
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                )}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', marginTop: 24, marginBottom: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: 20 }}>
            By signing in you agree to our{' '}
            <Link to="/terms" style={{ color: '#6B7280' }}>Terms</Link>{' '}and{' '}
            <Link to="/privacy" style={{ color: '#6B7280' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .login-left-panel { display: flex !important; flex-direction: column; justify-content: flex-end; } }
      `}</style>
    </div>
  );
};

export default Login;