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
  const hasJoined = userStatus?.hasJoined;
  const isWinner = userStatus?.isWinner;

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      notify.info('Authentication required. Please sign in to join this giveaway.');
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
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to all Giveaways</span>
          </Link>
        </div>

        {/* =========================================================================
            HERO PRIZE SHOWCASE CARD
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
            {/* Prize Image Column */}
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
                {/* Ambient glow */}
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

            {/* Prize Details & Join Box */}
            <div className="col-lg-7">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                {prize.badge && (
                  <span className="badge-veloop-gold">
                    <Sparkles size={14} />
                    {prize.badge}
                  </span>
                )}
                <span className="badge-veloop-coral" style={{ textTransform: 'capitalize' }}>
                  {giveaway.status}
                </span>
                <span className="badge-veloop-emerald">
                  <ShieldCheck size={14} /> Verified Prize
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '8px' }}>
                {giveaway.title}
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
                {giveaway.description}
              </p>

              {/* Countdown & Live Metric Box */}
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
                  Draw Countdown Timer
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
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Winners Drawn</div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        {giveaway.winnerCount || 1} Lucky Winner{giveaway.winnerCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Coins size={18} color="#3C9B76" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Retail Valuation</div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        ₹{(prize.retailValue || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Participation & Winner States */}
              {isWinner && (
                <div
                  style={{
                    background: 'rgba(60, 155, 118, 0.18)',
                    border: '1.5px solid rgba(60, 155, 118, 0.5)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Sparkles size={24} color="#3C9B76" />
                    <h4 style={{ margin: 0, fontWeight: 800, color: '#55d4a4' }}>
                      Congratulations! You Won This Giveaway!
                    </h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '14px' }}>
                    Your account has been officially selected as a verified winner. Status: <strong>{userStatus.claimStatus || 'Claim Available'}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsClaimModalOpen(true)}
                    className="btn-veloop-primary"
                    style={{ background: 'linear-gradient(135deg, #3C9B76 0%, #2a7255 100%)' }}
                  >
                    <Award size={18} />
                    <span>{userStatus.claimStatus === 'claim_completed' ? 'View Delivery Status' : 'Claim Your Prize Now'}</span>
                  </button>
                </div>
              )}

              {hasJoined && !isWinner && (
                <div
                  style={{
                    background: 'rgba(246, 200, 95, 0.12)',
                    border: '1.5px solid rgba(246, 200, 95, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 22px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={24} color="#F6C85F" />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                        You Are Officially Registered!
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                        Your VIP Ticket: <strong>{userStatus.ticketNumber}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="badge-veloop-emerald">Entry Confirmed</span>
                </div>
              )}

              {/* Pricing & Join Action */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Required Entry Fee
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
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
                  </div>
                  {isAuthenticated && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Your Balance: <strong>{currentBalance.toLocaleString()} {giveaway.currency}</strong>
                    </div>
                  )}
                </div>

                {!hasJoined && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {!hasSufficientBalance && isAuthenticated ? (
                      <button
                        type="button"
                        onClick={earnTokens}
                        className="btn-veloop-secondary"
                        style={{ padding: '14px 24px' }}
                      >
                        <Coins size={18} />
                        Earn Free {giveaway.currency}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleJoinClick}
                        className="btn-veloop-primary"
                        style={{ padding: '14px 34px', fontSize: '1.05rem' }}
                      >
                        <Ticket size={20} />
                        <span>Join Giveaway Now</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SPECIFICATIONS & RULES SECTION
            ========================================================================= */}
        <div className="row g-4">
          {/* Specifications */}
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
                Prize Specifications
              </h4>

              {prize.specifications && prize.specifications.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {prize.specifications.map((spec, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(33, 19, 38, 0.8)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>{spec.label}</span>
                      <strong style={{ color: '#FFFFFF' }}>{spec.value}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {prize.shortDescription || 'Full retail package and warranty included.'}
                </p>
              )}
            </div>
          </div>

          {/* Rules & Terms */}
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
                Official Giveaway Rules
              </h4>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {giveaway.rules && giveaway.rules.map((rule, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <ShieldCheck size={18} color="#3C9B76" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
