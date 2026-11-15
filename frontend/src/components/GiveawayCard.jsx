import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, ArrowRight, Sparkles } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export const GiveawayCard = ({ giveaway }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Every Join Now button / Card MUST navigate to its individual giveaway details page!
    navigate(`/giveaway/${giveaway.slug || giveaway._id}`);
  };

  const prize = giveaway.prize || {};
  const isDigital = prize.type === 'digital';

  return (
    <div
      className="veloop-glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={handleCardClick}
    >
      {/* Top Badges Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px 0 20px',
          zIndex: 2,
        }}
      >
        {prize.badge ? (
          <span
            className={
              prize.badge.includes('1st')
                ? 'badge-veloop-gold'
                : prize.badge.includes('2nd')
                ? 'badge-veloop-coral'
                : 'badge-veloop-emerald'
            }
          >
            <Sparkles size={12} />
            {prize.badge}
          </span>
        ) : (
          <span className="badge-veloop-gold">Featured</span>
        )}

        <span
          className="badge-veloop-coral"
          style={{ textTransform: 'capitalize' }}
        >
          {giveaway.status || 'Active'}
        </span>
      </div>

      {/* Prize Image Container with ambient glow */}
      <div
        style={{
          height: '210px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 20px',
          position: 'relative',
        }}
      >
        {/* Subtle radial ambient glow behind prize */}
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background:
              giveaway.currency === 'VEs'
                ? 'radial-gradient(circle, rgba(246, 200, 95, 0.22) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255, 107, 74, 0.25) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: 1,
          }}
        />

        <img
          src={prize.image || '/assets/prize-iphone-15-pro.png'}
          alt={prize.name || giveaway.title}
          style={{
            maxHeight: '180px',
            maxWidth: '100%',
            objectFit: 'contain',
            zIndex: 2,
            transition: 'transform 0.35s ease',
            filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.55))',
          }}
          className="prize-card-img"
        />
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: '0 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          zIndex: 2,
        }}
      >
        <h4
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '4px',
            lineHeight: 1.3,
            color: '#FFFFFF',
          }}
        >
          {giveaway.title}
        </h4>

        <p
          style={{
            fontSize: '0.84rem',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {giveaway.subtitle || giveaway.description}
        </p>

        {/* Live Metrics: Participants & Countdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'rgba(33, 19, 38, 0.75)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(246, 200, 95, 0.12)',
            marginBottom: '16px',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <Users size={14} color="#F6C85F" />
            <span>{(giveaway.totalParticipants || 0).toLocaleString()} Joined</span>
          </div>

          <CountdownTimer targetDate={giveaway.endDate} compact={true} />
        </div>

        {/* Entry Fee & Action Button */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Entry Fee
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 800,
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
          </div>

          <button
            type="button"
            className="btn-veloop-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-full)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <span>Join Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .veloop-glass-card:hover .prize-card-img {
          transform: translateY(-6px) scale(1.04);
        }
      `}</style>
    </div>
  );
};

export default GiveawayCard;
