import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, Heart, Mail, HelpCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #211326 0%, #150a18 100%)',
        borderTop: '1px solid rgba(246, 200, 95, 0.15)',
        color: 'var(--text-secondary)',
        paddingTop: '60px',
        paddingBottom: '36px',
        marginTop: '80px',
      }}
    >
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF6B4A 0%, #321D35 100%)',
                  border: '1.5px solid rgba(246, 200, 95, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    color: '#FFF7EA',
                  }}
                >
                  VR
                </span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF' }}>
                  VELOOP
                </span>
                <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 700, marginLeft: '6px' }}>
                  REWARDS
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '320px' }}>
              The premier rewards & giveaway platform. Transparent participation, cryptographically provable draws, and guaranteed prize fulfillment for thousands of active members.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
              <span className="badge-veloop-gold" style={{ fontSize: '0.74rem' }}>
                <ShieldCheck size={13} /> 100% Fair & Audited
              </span>
              <span className="badge-veloop-emerald" style={{ fontSize: '0.74rem' }}>
                <Lock size={13} /> Verified Delivery
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="col-lg-2 col-md-6">
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '16px' }}>
              Giveaways
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Featured Giveaways
                </Link>
              </li>
              <li>
                <Link to="/giveaway/iphone-15-pro" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  iPhone 15 Pro Draw
                </Link>
              </li>
              <li>
                <Link to="/giveaway/apple-watch" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Apple Watch Series 9
                </Link>
              </li>
              <li>
                <Link to="/giveaway/amazon-2000" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Amazon ₹2,000 Voucher
                </Link>
              </li>
              <li>
                <Link to="/winners" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Past Winners Roster
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="col-lg-3 col-md-6">
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '16px' }}>
              Rules & Trust
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <Link to="/rules" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Official Giveaway Rules
                </Link>
              </li>
              <li>
                <Link to="/rules#terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/rules#privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link to="/rules#fairness" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Provably Fair Selection
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="col-lg-3 col-md-6">
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '16px' }}>
              Help & Support
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Need assistance with entry confirmation, wallet balance, or prize delivery?
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--accent-coral)' }}>
              <Mail size={16} />
              <span>support@velooprewards.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <HelpCircle size={16} />
              <span>Available 24/7 for Member Claims</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(246, 200, 95, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            gap: '12px',
          }}
        >
          <div>
            © {new Date().getFullYear()} VELOOP Rewards Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Strict Zero-Blue Compliance</span>
            <span>•</span>
            <span>Authoritative Ledger Protected</span>
            <span>•</span>
            <span>SHA-256 Verified Entropy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
