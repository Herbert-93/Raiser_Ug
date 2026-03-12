import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RaiserLogo from '../UI/RaiserLogo';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Auth context - safe fallback if not yet wired up
  let user = null;
  let isAuthenticated = false;
  let logout = () => {};

  return (
    <nav style={{
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '68px'
        }}>

          {/* ── LOGO + BRAND NAME ── */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}>
            <RaiserLogo size={40} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#2563EB',
                letterSpacing: '-0.5px'
              }}>
                Raiser
              </span>
              <span style={{
                fontSize: '9px',
                color: '#9CA3AF',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                Uganda
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
            className="raiser-desktop-nav">
            {[
              { to: '/', label: 'Home' },
              { to: '/campaigns', label: 'Campaigns' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.target.style.color = '#2563EB'}
                onMouseLeave={e => e.target.style.color = '#374151'}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── AUTH BUTTONS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            className="raiser-desktop-nav">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  color: '#2563EB',
                  border: '1.5px solid #2563EB',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Dashboard
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#EF4444',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  color: '#2563EB',
                  border: '1.5px solid #2563EB',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Login
                </Link>
                <Link to="/register" style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#2563EB',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="raiser-mobile-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
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

        {/* ── MOBILE DROPDOWN MENU ── */}
        {isOpen && (
          <div style={{ borderTop: '1px solid #E5E7EB', padding: '12px 0 16px' }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/campaigns', label: 'Campaigns' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/login', label: 'Login' },
              { to: '/register', label: 'Sign Up' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'block',
                  padding: '10px 4px',
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '500',
                  borderBottom: '1px solid #F3F4F6'
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Responsive styles */}
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