import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RaiserLogo from '../UI/RaiserLogo';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAuthenticated, logout, avatarInitials, displayName } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/campaigns', label: 'Campaigns' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <nav style={{
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '68px',
        }}>

          {/* ── LOGO ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <RaiserLogo size={40} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#2563EB', letterSpacing: '-0.5px' }}>
                Raiser
              </span>
              <span style={{ fontSize: '9px', color: '#9CA3AF', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Uganda
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="raiser-desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                color: isActive(to) ? '#2563EB' : '#374151',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: isActive(to) ? '700' : '500',
                transition: 'color 0.2s',
                borderBottom: isActive(to) ? '2px solid #2563EB' : '2px solid transparent',
                paddingBottom: '2px',
              }}
                onMouseEnter={e => { if (!isActive(to)) e.target.style.color = '#2563EB'; }}
                onMouseLeave={e => { if (!isActive(to)) e.target.style.color = '#374151'; }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── AUTH AREA ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="raiser-desktop-nav">
            {isAuthenticated ? (
              <>
                {/* Start Campaign CTA */}
                <Link to="/create-campaign" style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1px solid #BFDBFE',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#DBEAFE'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                >
                  + New Campaign
                </Link>

                {/* Avatar dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: 'none', border: '1.5px solid #E5E7EB',
                      borderRadius: 24, padding: '5px 12px 5px 5px',
                      cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
                    onMouseLeave={e => !dropdownOpen && (e.currentTarget.style.borderColor = '#E5E7EB')}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0,
                    }}>
                      {avatarInitials}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayName?.split(' ')[0] || 'Account'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#9CA3AF', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      background: '#fff', borderRadius: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      border: '1px solid #E5E7EB', minWidth: 200, overflow: 'hidden', zIndex: 100,
                    }}>
                      {/* User info */}
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827' }}>{displayName}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>{user?.email}</p>
                      </div>

                      {[
                        { to: '/dashboard', label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg> },
                        { to: '/profile', label: 'My Profile', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
                        { to: '/create-campaign', label: 'Create Campaign', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '11px 16px', color: '#374151', textDecoration: 'none',
                          fontSize: '14px', fontWeight: 500, transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ color: '#6B7280' }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      <div style={{ borderTop: '1px solid #F3F4F6' }}>
                        <button onClick={handleLogout} style={{
                          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                          padding: '11px 16px', color: '#EF4444', background: 'none', border: 'none',
                          fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '8px 18px', borderRadius: '8px', color: '#2563EB',
                  border: '1.5px solid #2563EB', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Log In
                </Link>
                <Link to="/register" style={{
                  padding: '8px 20px', borderRadius: '8px', backgroundColor: '#2563EB',
                  color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '700',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; }}
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button onClick={() => setIsOpen(!isOpen)} className="raiser-mobile-btn" style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
          }}>
            {isOpen ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        {isOpen && (
          <div style={{ borderTop: '1px solid #E5E7EB', padding: '12px 0 16px' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setIsOpen(false)} style={{
                display: 'block', padding: '10px 4px', color: isActive(to) ? '#2563EB' : '#374151',
                textDecoration: 'none', fontSize: '15px', fontWeight: isActive(to) ? '700' : '500',
                borderBottom: '1px solid #F3F4F6',
              }}>
                {label}
              </Link>
            ))}
            <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{
                    display: 'block', padding: '10px', borderRadius: 8, textAlign: 'center',
                    color: '#2563EB', border: '1.5px solid #2563EB', textDecoration: 'none', fontWeight: 600,
                  }}>
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} style={{
                    display: 'block', padding: '10px', borderRadius: 8, textAlign: 'center',
                    color: '#374151', border: '1.5px solid #E5E7EB', textDecoration: 'none', fontWeight: 600,
                  }}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} style={{
                    padding: '10px', borderRadius: 8, background: '#FEF2F2', color: '#EF4444',
                    border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '15px', width: '100%',
                  }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} style={{
                    display: 'block', padding: '10px', borderRadius: 8, textAlign: 'center',
                    color: '#2563EB', border: '1.5px solid #2563EB', textDecoration: 'none', fontWeight: 600,
                  }}>
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} style={{
                    display: 'block', padding: '10px', borderRadius: 8, textAlign: 'center',
                    background: '#2563EB', color: '#fff', textDecoration: 'none', fontWeight: 700,
                  }}>
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .raiser-desktop-nav { display: none !important; }
          .raiser-mobile-btn  { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;