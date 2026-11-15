import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Gift,
  Coins,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Award,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, openAuthModal, earnTokens } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setWalletDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(33, 19, 38, 0.94)'
          : 'linear-gradient(180deg, rgba(33, 19, 38, 0.95) 0%, rgba(33, 19, 38, 0.8) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(246, 200, 95, 0.2)' : 'rgba(246, 200, 95, 0.1)'}`,
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : 'none',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B4A 0%, #321D35 100%)',
              border: '1.5px solid rgba(246, 200, 95, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255, 107, 74, 0.35)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.25rem',
                color: '#FFF7EA',
                letterSpacing: '-0.05em',
              }}
            >
              VR
            </span>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '0.04em',
                lineHeight: 1,
                color: '#FFFFFF',
              }}
            >
              VELOOP
            </div>
            <div
              style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              Rewards
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div
          className="d-none d-lg-flex"
          style={{
            alignItems: 'center',
            gap: '28px',
          }}
        >
          <Link
            to="/"
            style={{
              color: location.pathname === '/' ? 'var(--accent-coral)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'color 0.2s',
            }}
          >
            Home
          </Link>

          <a
            href="/#giveaways-section"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'color 0.2s',
            }}
          >
            Giveaways
          </a>

          <Link
            to="/winners"
            style={{
              color: location.pathname === '/winners' ? 'var(--accent-coral)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'color 0.2s',
            }}
          >
            Previous Winners
          </Link>

          <a
            href="/#how-it-works"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'color 0.2s',
            }}
          >
            How It Works
          </a>

          <a
            href="/#faq-section"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'color 0.2s',
            }}
          >
            FAQ
          </a>

          <Link
            to="/rules"
            style={{
              color: location.pathname === '/rules' ? 'var(--accent-coral)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.92rem',
              transition: 'color 0.2s',
            }}
          >
            Rules & Terms
          </Link>
        </div>

        {/* Right Action Controls: Wallet & Auth */}
        <div
          className="d-none d-md-flex"
          style={{
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {isAuthenticated ? (
            <>
              {/* Wallet Balances Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  style={{
                    background: 'rgba(50, 29, 53, 0.9)',
                    border: '1px solid rgba(246, 200, 95, 0.3)',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 16px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                  }}
                >
                  <Coins size={16} color="#F6C85F" />
                  <span style={{ color: 'var(--accent-gold)' }}>
                    {(user?.walletBalances?.VEs || 0).toLocaleString()} VEs
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {walletDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '260px',
                      background: 'var(--grad-card)',
                      border: '1px solid rgba(246, 200, 95, 0.25)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1100,
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Authoritative Wallet Balances
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>VEs Credits:</span>
                      <strong style={{ color: 'var(--accent-gold)' }}>
                        {(user?.walletBalances?.VEs || 0).toLocaleString()} VEs
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Special VEs (SVEs):</span>
                      <strong style={{ color: 'var(--accent-coral)' }}>
                        {(user?.walletBalances?.SVEs || 0).toLocaleString()} SVEs
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Daily Tokens:</span>
                      <strong style={{ color: '#55d4a4' }}>
                        {(user?.walletBalances?.Tokens || 0).toLocaleString()} Tokens
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        earnTokens();
                        setWalletDropdownOpen(false);
                      }}
                      className="btn-veloop-secondary"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '0.8rem' }}
                    >
                      <Sparkles size={14} />
                      Claim Free Test Tokens
                    </button>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    background: 'rgba(50, 29, 53, 0.9)',
                    border: '1px solid rgba(255, 107, 74, 0.3)',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 14px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--grad-coral)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '220px',
                      background: 'var(--grad-card)',
                      border: '1px solid rgba(246, 200, 95, 0.25)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '10px',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1100,
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(246, 200, 95, 0.15)', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    </div>

                    <Link
                      to="/claims"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.86rem',
                        borderRadius: 'var(--radius-xs)',
                        transition: 'background 0.2s',
                      }}
                    >
                      <Award size={16} color="#F6C85F" />
                      <span>My Wins & Claims</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          color: '#55d4a4',
                          textDecoration: 'none',
                          fontSize: '0.86rem',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        <Shield size={16} color="#3C9B76" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        color: 'var(--accent-coral)',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="btn-veloop-outline"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="btn-veloop-primary"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="d-flex d-lg-none" style={{ gap: '10px', alignItems: 'center' }}>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => earnTokens()}
              className="btn-veloop-secondary d-md-none"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            >
              + Tokens
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none"
          style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid rgba(246, 200, 95, 0.15)',
            padding: '24px 20px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isAuthenticated && (
              <div
                style={{
                  background: 'rgba(33, 19, 38, 0.9)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(246, 200, 95, 0.2)',
                  marginBottom: '10px',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in as:</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>{user?.name}</div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <span className="currency-pill ves">{user?.walletBalances?.VEs} VEs</span>
                  <span className="currency-pill sves">{user?.walletBalances?.SVEs} SVEs</span>
                </div>
              </div>
            )}

            <Link
              to="/"
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              Home
            </Link>
            <a
              href="/#giveaways-section"
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              Giveaways
            </a>
            <Link
              to="/winners"
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              Previous Winners
            </Link>
            <a
              href="/#how-it-works"
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              How It Works
            </a>
            <a
              href="/#faq-section"
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              FAQ
            </a>
            <Link
              to="/rules"
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
            >
              Rules & Terms
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/claims"
                  style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
                >
                  My Wins & Claims
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    style={{ color: '#55d4a4', textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="btn-veloop-outline"
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Sign Out
                </button>
              </>
            )}

            {!isAuthenticated && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="btn-veloop-outline"
                  style={{ width: '100%' }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="btn-veloop-primary"
                  style={{ width: '100%' }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
