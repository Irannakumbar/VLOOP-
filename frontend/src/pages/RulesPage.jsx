import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Lock, Award } from 'lucide-react';

export const RulesPage = () => {
  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge-veloop-gold" style={{ marginBottom: '10px' }}>
            OFFICIAL PLATFORM POLICIES
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900 }}>
            Official Giveaway Rules & Terms
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
            Comprehensive rules, eligibility standards, provably fair draw mechanisms, and prize fulfillment.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Section 1: Participation & Single Entry */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.85) 0%, rgba(33, 19, 38, 0.95) 100%)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
            }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '14px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#F6C85F" />
              1. Single-Entry Participation Policy
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '12px' }}>
              To ensure complete fairness for all participants, every verified VELOOP account is permitted exactly one entry per active giveaway. Our backend database strictly enforces this constraint through compound unique indexes on User ID and Giveaway ID. Any automated attempts to generate duplicate entries or bypass balance requirements are flagged by our security middleware.
            </p>
          </div>

          {/* Section 2: Authoritative Ledger & Balances */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.85) 0%, rgba(33, 19, 38, 0.95) 100%)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
            }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '14px', color: 'var(--accent-coral)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={22} color="#FF6B4A" />
              2. Transaction & Wallet Integrity
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '12px' }}>
              All entry fees (in VEs, SVEs, or Tokens) are authoritatively verified and deducted by our server-side ledger. The frontend client does not dictate balances or entry fees. Each transaction generates an immutable transaction reference (TXN-VR) linked to your confirmed VIP ticket number.
            </p>
          </div>

          {/* Section 3: Provably Fair Selection */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.85) 0%, rgba(33, 19, 38, 0.95) 100%)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
            }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '14px', color: '#55d4a4', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={22} color="#3C9B76" />
              3. Provably Fair Winner Selection Engine
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '12px' }}>
              When a giveaway countdown concludes, the winner is drawn using a cryptographically secure pseudo-random algorithm. A unique SHA-256 seed hash combining the giveaway timestamp, participant collection, and server entropy is recorded and published alongside the masked winner ID.
            </p>
          </div>

          {/* Section 4: Prize Claim & Dispatch */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.85) 0%, rgba(33, 19, 38, 0.95) 100%)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
            }}
          >
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '14px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} color="#F6C85F" />
              4. Prize Claim Deadlines & Dispatch
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '12px' }}>
              Winners are allotted 14 calendar days from the date of announcement to submit their verified claim details.
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <li>• <strong>Physical Prizes:</strong> Require full recipient name, contact phone number, and residential delivery address. Dispatched via insured express couriers with tracking numbers.</li>
              <li>• <strong>Digital Gift Cards:</strong> Delivered to the account's registered email address upon verification.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
