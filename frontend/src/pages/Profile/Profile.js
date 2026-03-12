import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, profile, updateProfile, forgotPassword, avatarInitials, displayName } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    } else if (user) {
      setForm({
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        bio: '',
      });
    }
  }, [profile, user]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) { toast.error('Full name is required'); return; }
    setLoading(true);
    const result = await updateProfile(form);
    setLoading(false);
    if (result.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  const fieldStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid #E5E7EB', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', color: '#111827', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: 8 }}>My Profile</h1>
      <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: 32 }}>Manage your personal information and preferences.</p>

      {/* Avatar Card */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '28px', fontWeight: 800, flexShrink: 0,
          }}>
            {avatarInitials}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0, marginBottom: 4 }}>
              {displayName || 'Your Name'}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0, marginBottom: 6 }}>{user?.email}</p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: user?.email_confirmed_at ? '#ECFDF5' : '#FEF3C7',
              color: user?.email_confirmed_at ? '#059669' : '#D97706',
              fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: 20,
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <circle cx="5" cy="5" r="5"/>
              </svg>
              {user?.email_confirmed_at ? 'Email Verified' : 'Email Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: 24, marginTop: 0 }}>Personal Information</h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="profile-grid">
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input name="full_name" type="text" value={form.full_name} onChange={handleChange}
                placeholder="Your full name" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Phone Number
              </label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="0712 345 678" style={fieldStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Email Address <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(cannot be changed here)</span>
            </label>
            <input type="email" value={user?.email || ''} readOnly style={{
              ...fieldStyle, background: '#F9FAFB', color: '#9CA3AF', cursor: 'not-allowed',
            }} />
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Bio <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea name="bio" rows={3} value={form.bio} onChange={handleChange}
              placeholder="Tell people a bit about yourself and why you support causes on Raiser..."
              style={{ ...fieldStyle, resize: 'vertical', minHeight: 88 }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: 4 }}>Shown on your public profile and campaign pages.</p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 4 }}>
            <button type="submit" disabled={loading} style={{
              padding: '12px 28px', borderRadius: 10, border: 'none',
              background: saved ? '#059669' : (loading ? '#93C5FD' : '#2563EB'),
              color: '#fff', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {loading && <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>}
              {saved && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>}
              {loading ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
            </button>

            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-UG', { year: 'numeric', month: 'long' }) : '—'}
            </span>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #FEE2E2', marginTop: 24 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#991B1B', marginBottom: 8, marginTop: 0 }}>Danger Zone</h3>
        <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: 16 }}>
          Need to update your password? We'll send a reset link to your email.
        </p>
        <button
          onClick={async () => {
            if (user?.email) {
              await forgotPassword(user.email);
            }
          }}
          style={{
            padding: '10px 20px', borderRadius: 8, border: '1.5px solid #FCA5A5',
            background: '#FEF2F2', color: '#DC2626', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Send Password Reset Email
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default Profile;