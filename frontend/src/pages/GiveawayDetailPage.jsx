import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Award,
  ShieldCheck,
  Clock,
  Sparkles,
  Ticket,
  AlertCircle,
  CheckCircle,
  Coins,
  FileText,
  HelpCircle,
  Gift,
  ChevronDown,
  Info,
  Calendar,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { giveawayAPI } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import VeloopLoader from '../components/VeloopLoader';
import JoinModal from '../components/JoinModal';
import ClaimModal from '../components/ClaimModal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const GiveawayDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal, earnTokens } = useAuth();
  const { notify } = useNotification();

  const [giveaway, setGiveaway] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openImportantInfo, setOpenImportantInfo] = useState(true);

  // Modals state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const fetchGiveawayDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await giveawayAPI.getById(slug);
      if (res?.data) {
        setGiveaway(res.data.giveaway);
        setUserStatus(res.data.userStatus);
      }
    } catch (err) {
      console.error('Failed to load giveaway details:', err);
      setError(err.message || 'Unable to load giveaway details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGiveawayDetails();
  }, [slug, isAuthenticated]);

  if (isLoading) {
    return <VeloopLoader message="Retrieving Giveaway & Ledger Details..." />;
  }

  if (error || !giveaway) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <AlertCircle size={48} color="#FF6B4A" style={{ marginBottom: '16px' }} />
        <h3>Giveaway Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {error || 'The giveaway you requested does not exist or has been archived.'}
        </p>
        <button onClick={() => navigate('/')} className="btn-veloop-primary">
          <ArrowLeft size={16} /> Return to Giveaways
        </button>
      </div>
    );
  }

  const prize = giveaway.prize || {};
  const currentBalance = user?.walletBalances?.[giveaway.currency] || 0;
  const hasSufficientBalance = currentBalance >= giveaway.entryFee;
  const deficit = Math.max(0, giveaway.entryFee - currentBalance);
  const hasJoined = userStatus?.hasJoined;
  const isWinner = userStatus?.isWinner;
  const isEnded = giveaway.status === 'ended' || giveaway.status === 'drawn';
  const isUpcoming = giveaway.status === 'upcoming';

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      notify.info('Please login or create an account to participate in this giveaway.');
      openAuthModal('login');
      return;
    }

    if (hasJoined) {
      notify.info(`You have already joined with ticket ${userStatus.ticketNumber}!`);
      return;
    }

    setIsJoinModalOpen(true);
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={18} />
            <span>← Giveaway Home</span>
          </Link>
        </div>

        {/* =========================================================================
            HEADER & PRIZE HERO (Sections 81, 82, 83)
            ========================================================================= */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.9) 0%, rgba(33, 19, 38, 0.95) 100%)',
            border: '1.5px solid rgba(246, 200, 95, 0.25)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '40px',
            position: 'relative',
          }}
        >
          <div className="row g-4 align-items-center">
            {/* Prize Image */}
            <div className="col-lg-5 text-center">
              <div
                style={{
                  position: 'relative',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    background:
                      giveaway.currency === 'VEs'
                        ? 'radial-gradient(circle, rgba(246, 200, 95, 0.25) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(255, 107, 74, 0.28) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                  }}
                />

                <img
                  src={prize.image || '/assets/prize-iphone-15-pro.png'}
                  alt={prize.name}
                  style={{
                    maxHeight: '340px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 2,
                    filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.75))',
                  }}
                />
              </div>
            </div>

            {/* Prize Details & Pricing */}
            <div className="col-lg-7">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <span className="badge-veloop-gold">
                  <Sparkles size={14} />
                  {prize.badge || 'EXCLUSIVE GIVEAWAY'}
                </span>
                <span className="badge-veloop-coral" style={{ textTransform: 'uppercase' }}>
                  ● GIVEAWAY {giveaway.status === 'active' ? 'LIVE' : giveaway.status}
                </span>
                <span className="badge-veloop-emerald">
                  <ShieldCheck size={14} /> 100% Verified Prize
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '8px' }}>
                Win an {giveaway.title}
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
                {giveaway.description}
              </p>

              {/* Countdown & Stats Box */}
              <div
                style={{
                  background: 'rgba(33, 19, 38, 0.85)',
                  border: '1px solid rgba(246, 200, 95, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Draw Countdown
                </div>
                <CountdownTimer targetDate={giveaway.endDate} />

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(246, 200, 95, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="#F6C85F" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Participants</div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        {(giveaway.totalParticipants || 0).toLocaleString()} Users
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={18} color="#FF6B4A" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Winners</div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        {giveaway.winnerCount || 1} Winner{giveaway.winnerCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Coins size={18} color="#3C9B76" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prize Value</div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        ₹{(prize.retailValue || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 26 & 27: Winner State Claim Section */}
              {isWinner && (
                <div
                  style={{
                    background: 'rgba(60, 155, 118, 0.18)',
                    border: '1.5px solid rgba(60, 155, 118, 0.5)',
                    borderRadius: 'var(--radius-md)',
                    padding: '22px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Sparkles size={24} color="#3C9B76" />
                    <h4 style={{ margin: 0, fontWeight: 800, color: '#55d4a4' }}>
                      🎁 Congratulations! You won {prize.name || giveaway.title}!
                    </h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px' }}>
                    Status: <strong>Winner ✓</strong> • Claim window: <strong>14 days remaining</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsClaimModalOpen(true)}
                    className="btn-veloop-primary"
                    style={{ background: 'linear-gradient(135deg, #3C9B76 0%, #2a7255 100%)' }}
                  >
                    <Award size={18} />
                    <span>{userStatus.claimStatus === 'claim_completed' ? 'View Delivery Status' : 'Claim Your Prize'}</span>
                  </button>
                </div>
              )}

              {/* SECTION 33: Non-Winner State */}
              {isEnded && !isWinner && (
                <div
                  style={{
                    background: 'rgba(50, 29, 53, 0.85)',
                    border: '1px solid rgba(246, 200, 95, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <h5 style={{ fontWeight: 800, marginBottom: '6px' }}>Didn't win this time?</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '14px' }}>
                    Thanks for participating! Winners have been officially announced. Keep participating for the next giveaway!
                  </p>
                  <Link to="/" className="btn-veloop-secondary">
                    <span>Explore Next Giveaway →</span>
                  </Link>
                </div>
              )}

              {/* SECTION 56: Participant State (Already Joined) */}
              {hasJoined && !isWinner && !isEnded && (
                <div
                  style={{
                    background: 'rgba(246, 200, 95, 0.12)',
                    border: '1.5px solid rgba(246, 200, 95, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle size={26} color="#F6C85F" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-gold)' }}>
                          You're Participating ✓
                        </div>
                        <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                          Your Entries: <strong>1 Entry</strong> • VIP Ticket: <strong>{userStatus.ticketNumber}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={earnTokens}
                      className="btn-veloop-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      <Coins size={14} /> Earn More Entries →
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 85, 86, 88: Entry Fee & Cost Breakdown */}
              {!hasJoined && !isEnded && (
                <div
                  style={{
                    background: 'rgba(33, 19, 38, 0.9)',
                    border: '1px solid rgba(246, 200, 95, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Entry Fee:</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.8rem',
                        fontWeight: 900,
                        color:
                          giveaway.currency === 'VEs'
                            ? 'var(--accent-gold)'
                            : giveaway.currency === 'SVEs'
                            ? 'var(--accent-coral)'
                            : '#55d4a4',
                      }}
                    >
                      {giveaway.entryFee} {giveaway.currency}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    ≈ Required balance: {giveaway.entryFee} {giveaway.currency}
                  </div>

                  {isAuthenticated && (
                    <div style={{ fontSize: '0.86rem', padding: '10px 14px', background: 'rgba(50, 29, 53, 0.6)', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Your Current Balance:</span>
                        <strong style={{ color: 'var(--accent-gold)' }}>
                          {currentBalance.toLocaleString()} {giveaway.currency}
                        </strong>
                      </div>

                      {hasSufficientBalance ? (
                        <div style={{ color: '#55d4a4', fontSize: '0.82rem', fontWeight: 600 }}>
                          ✓ You have enough {giveaway.currency}
                        </div>
                      ) : (
                        <div style={{ color: '#FF6B4A', fontSize: '0.82rem', fontWeight: 600 }}>
                          ⚠️ Insufficient {giveaway.currency}. You need {deficit.toLocaleString()} more {giveaway.currency} to participate.
                        </div>
                      )}
                    </div>
                  )}

                  {/* SECTION 17: Primary CTA with dynamic states */}
                  <div>
                    {!isAuthenticated ? (
                      <button
                        type="button"
                        onClick={handleJoinClick}
                        className="btn-veloop-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                      >
                        Login to Participate
                      </button>
                    ) : !hasSufficientBalance ? (
                      <button
                        type="button"
                        onClick={earnTokens}
                        className="btn-veloop-secondary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                      >
                        <Coins size={18} />
                        Earn More {giveaway.currency} →
                      </button>
                    ) : isUpcoming ? (
                      <button
                        type="button"
                        onClick={() => notify.success('Notification set for upcoming giveaway launch!')}
                        className="btn-veloop-secondary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                      >
                        Notify Me
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleJoinClick}
                        className="btn-veloop-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                      >
                        <Ticket size={20} />
                        <span>Join Giveaway – {giveaway.entryFee} {giveaway.currency}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 90: HOW THIS GIVEAWAY WORKS (7-Step Timeline from PDF)
            ========================================================================= */}
        <div
          style={{
            background: 'rgba(50, 29, 53, 0.7)',
            border: '1px solid rgba(246, 200, 95, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            marginBottom: '40px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="badge-veloop-gold" style={{ marginBottom: '8px' }}>
              STEP-BY-STEP PROCESS
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              How This Giveaway Works
            </h3>
          </div>

          <div className="row g-3">
            {[
              { step: '01', title: 'Review the giveaway', desc: 'Inspect prize specs and retail value.' },
              { step: '02', title: 'Check your eligibility', desc: 'Verified account with valid currency.' },
              { step: '03', title: 'Pay required entry', desc: `${giveaway.entryFee} ${giveaway.currency} authoritative fee.` },
              { step: '04', title: 'Participation recorded', desc: 'Immutable VIP ticket logged to ledger.' },
              { step: '05', title: 'Wait until draw ends', desc: 'Real-time countdown timer tracking.' },
              { step: '06', title: 'Winner is selected', desc: 'Provably fair SHA-256 random draw.' },
              { step: '07', title: 'Winner claims prize', desc: 'Courier dispatch or instant voucher delivery.' },
            ].map((st, i) => (
              <div key={i} className="col-lg col-md-4 col-sm-6">
                <div
                  style={{
                    background: 'rgba(33, 19, 38, 0.8)',
                    border: '1px solid rgba(246, 200, 95, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    height: '100%',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      color: 'var(--accent-gold)',
                      fontSize: '1.2rem',
                      marginBottom: '6px',
                    }}
                  >
                    {st.step}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#FFFFFF', marginBottom: '4px' }}>
                    {st.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {st.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            SECTION 93: ABOUT THE PRIZE
            ========================================================================= */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div
              style={{
                background: 'rgba(50, 29, 53, 0.7)',
                border: '1px solid rgba(246, 200, 95, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                height: '100%',
              }}
            >
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--accent-gold)" />
                About the Prize
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(33, 19, 38, 0.8)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Product Name:</span>
                  <strong style={{ color: '#FFFFFF' }}>{prize.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(33, 19, 38, 0.8)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Prize Type:</span>
                  <strong style={{ color: 'var(--accent-gold)', textTransform: 'capitalize' }}>
                    {prize.type === 'physical' ? 'Physical Product (Postal Delivery)' : 'Digital Voucher (Instant Email)'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(33, 19, 38, 0.8)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Official Retail Valuation:</span>
                  <strong style={{ color: '#55d4a4' }}>₹{(prize.retailValue || 0).toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(33, 19, 38, 0.8)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Number of Winners:</span>
                  <strong style={{ color: '#FFFFFF' }}>{giveaway.winnerCount || 1} Winner(s)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(33, 19, 38, 0.8)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fulfillment Method:</span>
                  <strong style={{ color: 'var(--accent-coral)' }}>
                    {prize.type === 'physical' ? 'Tracked Courier Express' : 'Direct Digital Delivery'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 91: IMPORTANT TERMS & CONDITIONS */}
          <div className="col-lg-6">
            <div
              style={{
                background: 'rgba(50, 29, 53, 0.7)',
                border: '1px solid rgba(246, 200, 95, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                height: '100%',
              }}
            >
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--accent-coral)" />
                Important Terms & Conditions
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <div>
                  <strong style={{ color: 'var(--accent-gold)' }}>• Eligibility:</strong> All verified VELOOP accounts in good standing with sufficient balance.
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-gold)' }}>• Entry Requirement:</strong> Exactly {giveaway.entryFee} {giveaway.currency} deducted authoritatively upon confirmation.
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-gold)' }}>• Participation Policy:</strong> Single entry per verified user account.
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-gold)' }}>• Winner Selection:</strong> Provably fair pseudo-random algorithm with SHA-256 entropy hashes.
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-gold)' }}>• Claim Deadline:</strong> Winners must submit claim details within 14 calendar days of announcement.
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-gold)' }}>• Disqualification Policy:</strong> Automated bots, tampered headers, or suspicious duplicate activity results in disqualification.
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-gold)' }}>• Refund Policy:</strong> Standard entry fees are non-refundable once VIP ticket is generated unless the giveaway is cancelled by administration.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 92: IMPORTANT INFORMATION (Expandable Accordion)
            ========================================================================= */}
        <div
          style={{
            background: 'rgba(50, 29, 53, 0.75)',
            border: '1px solid rgba(246, 200, 95, 0.2)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setOpenImportantInfo(!openImportantInfo)}
            style={{
              width: '100%',
              padding: '20px 28px',
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 800,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={20} color="var(--accent-gold)" />
              Important Information (Read Before Joining)
            </span>
            <ChevronDown
              size={20}
              color="var(--accent-gold)"
              style={{
                transform: openImportantInfo ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
              }}
            />
          </button>

          {openImportantInfo && (
            <div
              style={{
                padding: '0 28px 24px 28px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                borderTop: '1px solid rgba(246, 200, 95, 0.1)',
                paddingTop: '16px',
              }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <strong>Entry Currency:</strong> {giveaway.currency}
                </div>
                <div className="col-md-6">
                  <strong>Entry Amount:</strong> {giveaway.entryFee} {giveaway.currency}
                </div>
                <div className="col-md-6">
                  <strong>Duration:</strong> Active until {new Date(giveaway.endDate).toLocaleString()}
                </div>
                <div className="col-md-6">
                  <strong>Winner Selection:</strong> Cryptographic SHA-256 entropy draw
                </div>
                <div className="col-md-6">
                  <strong>Fraud Prevention:</strong> Protected by compound unique index & rate limiters
                </div>
                <div className="col-md-6">
                  <strong>Claim Requirements:</strong> Valid residential postal address or verified email
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Participation Modal */}
      <JoinModal
        giveaway={giveaway}
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinSuccess={(result) => {
          fetchGiveawayDetails();
        }}
      />

      {/* Claim Prize Modal */}
      <ClaimModal
        giveaway={giveaway}
        winnerRecord={userStatus}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onClaimSuccess={() => {
          fetchGiveawayDetails();
        }}
      />
    </div>
  );
};

export default GiveawayDetailPage;
