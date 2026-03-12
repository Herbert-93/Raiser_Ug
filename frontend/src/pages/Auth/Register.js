import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#EF4444', '#F59E0B', '#10B981'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < score ? colors[score - 1] : '#E5E7EB',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: 3, color: c.ok ? '#10B981' : '#9CA3AF' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              {c.ok
                ? <path d="M2 5l2 2 4-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                : <circle cx="5" cy="5" r="4" stroke="#D1D5DB" strokeWidth="1.2"/>
              }
            </svg>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const Register = () => {
  const { register: registerUser, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required';
    else if (form.full_name.trim().split(' ').length < 2) errs.full_name = 'Enter your first and last name';

    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';

    if (form.phone && !/^(\+256|0)[37]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = 'Enter a valid Uganda phone number (e.g. 0712345678)';
    }

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (!agreedToTerms) errs.terms = 'You must agree to the terms to continue';

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
    const result = await registerUser({
      full_name: form.full_name.trim(),
      email: form.email,
      phone: form.phone || null,
      password: form.password,
    });
    setLoading(false);
    if (result.success) {
      if (result.requiresEmailConfirmation) setEmailSent(true);
      else navigate('/dashboard', { replace: true });
    } else {
      setErrors({ general: result.error });
    }
  };

  /* ── Email sent confirmation screen ── */
  if (emailSent) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: 24 }}>
        <div style={{ maxWidth: 440, width: '100%', background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 4px 40px rgba(37,99,235,0.10)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="#10B981" strokeWidth="2"/>
              <path d="M22 6l-10 7L2 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: 12 }}>Check your inbox</h2>
          <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.6, marginBottom: 8 }}>
            We've sent a confirmation link to
          </p>
          <p style={{ color: '#2563EB', fontWeight: 700, fontSize: '15px', marginBottom: 24 }}>{form.email}</p>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: 32, lineHeight: 1.6 }}>
            Click the link in the email to activate your account. Check your spam folder if you don't see it.
          </p>
          <Link to="/login" style={{
            display: 'block', padding: '13px', borderRadius: 12, background: '#2563EB',
            color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 700,
          }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1.5px solid ${errors[field] ? '#EF4444' : '#E5E7EB'}`,
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: errors[field] ? '#FEF2F2' : '#fff',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F0F4FF' }}>
      {/* Left Panel */}
      <div style={{
        display: 'none', flex: 1, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(150deg, #1e3a8a 0%, #2563eb 60%, #60a5fa 100%)',
        flexDirection: 'column', justifyContent: 'flex-end', padding: '60px',
      }} className="register-left-panel">
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)',
            width: `${200 + i * 100}px`, height: `${200 + i * 100}px`,
            top: '20%', right: '-10%',
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 10, color: '#fff' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '20px 24px', marginBottom: 32, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Raised this month</div>
            <div style={{ fontSize: '32px', fontWeight: 800 }}>UGX 184M+</div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>
            Start raising funds<br />for what matters most
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.7, marginBottom: 32 }}>
            Create your free account and launch a campaign in minutes. No experience needed — Raiser handles everything.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '✅', text: 'Free to create a campaign' },
              { icon: '🔒', text: 'Secure UGX payments via MTN & Airtel' },
              { icon: '📊', text: 'Real-time fundraising dashboard' },
              { icon: '💬', text: '24/7 community support' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Logo */}
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

          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 40px', boxShadow: '0 4px 40px rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.08)' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: 6, textAlign: 'center' }}>Create your account</h1>
            <p style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: 24 }}>Free forever. No credit card required.</p>

            {/* Google */}
            <button onClick={loginWithGoogle} type="button" style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '11px 0', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#fff',
              cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: 20,
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
              Sign up with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>or with email</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>

            {errors.general && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full Name</label>
                <input name="full_name" type="text" value={form.full_name} onChange={handleChange}
                  placeholder="Amara Nakato" autoComplete="name" style={inputStyle('full_name')}
                  onFocus={e => !errors.full_name && (e.target.style.borderColor = '#2563EB')}
                  onBlur={e => !errors.full_name && (e.target.style.borderColor = '#E5E7EB')}
                />
                {errors.full_name && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.full_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" autoComplete="email" style={inputStyle('email')}
                  onFocus={e => !errors.email && (e.target.style.borderColor = '#2563EB')}
                  onBlur={e => !errors.email && (e.target.style.borderColor = '#E5E7EB')}
                />
                {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Phone Number <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
                </label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="0712 345 678" autoComplete="tel" style={inputStyle('phone')}
                  onFocus={e => !errors.phone && (e.target.style.borderColor = '#2563EB')}
                  onBlur={e => !errors.phone && (e.target.style.borderColor = '#E5E7EB')}
                />
                {errors.phone && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.phone}</p>}
                {!errors.phone && <p style={{ color: '#9CA3AF', fontSize: '11px', marginTop: 4 }}>For MTN & Airtel Money payment notifications</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPassword ? 'text' : 'password'}
                    value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                    style={{ ...inputStyle('password'), paddingRight: 44 }}
                    onFocus={e => !errors.password && (e.target.style.borderColor = '#2563EB')}
                    onBlur={e => !errors.password && (e.target.style.borderColor = '#E5E7EB')}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
                  }}>
                    {showPassword
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                    }
                  </button>
                </div>
                <PasswordStrength password={form.password} />
                {errors.password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password"
                    style={{ ...inputStyle('confirmPassword'), paddingRight: 44 }}
                    onFocus={e => !errors.confirmPassword && (e.target.style.borderColor = '#2563EB')}
                    onBlur={e => !errors.confirmPassword && (e.target.style.borderColor = '#E5E7EB')}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
                  }}>
                    {showConfirm
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                    }
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <div style={{ position: 'relative', marginTop: 1, flexShrink: 0 }}>
                    <input type="checkbox" checked={agreedToTerms} onChange={e => { setAgreedToTerms(e.target.checked); if (errors.terms) setErrors(p => ({ ...p, terms: '' })); }}
                      style={{ width: 16, height: 16, accentColor: '#2563EB', cursor: 'pointer' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>
                    I agree to Raiser's{' '}
                    <Link to="/terms" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: 4 }}>{errors.terms}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: loading ? '#93C5FD' : '#2563EB', color: '#fff', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
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
                {loading ? 'Creating account…' : 'Create Free Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B7280', marginTop: 24, marginBottom: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 768px) { .register-left-panel { display: flex !important; } }
      `}</style>
    </div>
  );
};

export default Register;