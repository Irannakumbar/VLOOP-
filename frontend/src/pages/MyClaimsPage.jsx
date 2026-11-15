import React, { useState, useEffect } from 'react';
import { Award, Package, Mail, MapPin, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { claimAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VeloopLoader from '../components/VeloopLoader';
import ClaimModal from '../components/ClaimModal';

export const MyClaimsPage = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [wins, setWins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeClaimGiveaway, setActiveClaimGiveaway] = useState(null);

  const fetchMyWins = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await claimAPI.getMyWins();
      if (res?.data?.wins) {
        setWins(res.data.wins);
      }
    } catch (err) {
      console.error('Failed to load user wins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyWins();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <Award size={48} color="#FF6B4A" style={{ marginBottom: '16px' }} />
        <h3>Sign In Required</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Please log in to view your prizes, claim statuses, and courier tracking details.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn-veloop-primary">
          Sign In to VELOOP
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <VeloopLoader message="Loading your prizes & claim records..." />;
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <span className="badge-veloop-gold" style={{ marginBottom: '8px' }}>
            MY REWARDS CENTER
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 800 }}>
            My Won Prizes & Claims
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem' }}>
            Track postal courier dispatches and access your digital voucher redemption codes.
          </p>
        </div>

        {/* Wins List */}
        {wins.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {wins.map((win) => {
              const prize = win.prizeId || {};
              const claim = win.claim;
              const isPhysical = prize.type === 'physical';
              const isClaimed = win.claimStatus !== 'claim_available';

              return (
                <div
                  key={win._id}
                  style={{
                    background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.85) 0%, rgba(33, 19, 38, 0.95) 100%)',
                    border: '1.5px solid rgba(246, 200, 95, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div className="row g-4 align-items-center">
                    <div className="col-md-3 text-center">
                      <img
                        src={prize.image || '/assets/hero-gift-box.png'}
                        alt={prize.name}
                        style={{
                          maxHeight: '120px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge-veloop-gold">Rank #{win.rank} Winner</span>
                        <span className="badge-veloop-coral">{isPhysical ? 'Physical Prize' : 'Digital Voucher'}</span>
                      </div>

                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>
                        {prize.name}
                      </h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '14px' }}>
                        Won on: {new Date(win.announcedAt).toLocaleDateString()}
                      </p>

                      {/* Claim Status Indicator */}
                      <div
                        style={{
                          background: 'rgba(33, 19, 38, 0.8)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px 16px',
                          border: '1px solid rgba(246, 200, 95, 0.15)',
                          fontSize: '0.86rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <CheckCircle2 size={16} color="#3C9B76" />
                          <strong style={{ color: '#55d4a4' }}>
                            {win.claimStatus === 'claim_completed'
                              ? 'Claim Fulfilled & Completed'
                              : win.claimStatus === 'claim_processing'
                              ? 'Fulfillment In Transit'
                              : win.claimStatus === 'claim_submitted'
                              ? 'Claim Submitted & Awaiting Dispatch'
                              : 'Claim Available'}
                          </strong>
                        </div>

                        {claim && claim.trackingCode && (
                          <div style={{ color: 'var(--accent-gold)', marginTop: '4px' }}>
                            <Truck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Courier Tracking:{' '}
                            <strong>
                              {claim.courierPartner || 'Carrier'} — {claim.trackingCode}
                            </strong>
                          </div>
                        )}

                        {claim && claim.digitalDetails?.voucherCode && (
                          <div style={{ color: '#55d4a4', marginTop: '6px' }}>
                            Voucher Code:{' '}
                            <strong style={{ letterSpacing: '0.08em', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '4px' }}>
                              {claim.digitalDetails.voucherCode}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-3 text-md-end text-center">
                      {!isClaimed ? (
                        <button
                          type="button"
                          onClick={() => setActiveClaimGiveaway({ ...win.giveawayId, prize })}
                          className="btn-veloop-primary"
                          style={{ width: '100%' }}
                        >
                          <span>Submit Claim</span>
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>
                          <ShieldCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                          Verified Claim
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'rgba(50, 29, 53, 0.5)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(246, 200, 95, 0.15)',
            }}
          >
            <Award size={48} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
            <h3>No Prize Wins Recorded Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px auto' }}>
              You have not won any giveaways yet. Join more active giveaways to increase your chances!
            </p>
            <a href="/#giveaways-section" className="btn-veloop-primary">
              Explore Active Giveaways
            </a>
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {activeClaimGiveaway && (
        <ClaimModal
          giveaway={activeClaimGiveaway}
          isOpen={!!activeClaimGiveaway}
          onClose={() => setActiveClaimGiveaway(null)}
          onClaimSuccess={() => {
            setActiveClaimGiveaway(null);
            fetchMyWins();
          }}
        />
      )}
    </div>
  );
};

export default MyClaimsPage;
