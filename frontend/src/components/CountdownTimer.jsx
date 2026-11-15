import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ targetDate, compact = false, label = 'Ends In' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isEnded) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-coral)',
          fontWeight: 600,
          fontSize: compact ? '0.82rem' : '0.95rem',
        }}
      >
        <Clock size={compact ? 14 : 16} /> Giveaway Ended
      </span>
    );
  }

  if (compact) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-gold)',
          fontWeight: 600,
          fontSize: '0.85rem',
        }}
      >
        <Clock size={14} color="#F6C85F" />
        {timeLeft.days}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m left
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            background: 'rgba(33, 19, 38, 0.9)',
            border: '1px solid rgba(246, 200, 95, 0.25)',
            borderRadius: '10px',
            padding: '6px 10px',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {timeLeft.days}
          </div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Days</div>
        </div>

        <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>:</span>

        <div
          style={{
            background: 'rgba(33, 19, 38, 0.9)',
            border: '1px solid rgba(246, 200, 95, 0.25)',
            borderRadius: '10px',
            padding: '6px 10px',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Hours</div>
        </div>

        <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>:</span>

        <div
          style={{
            background: 'rgba(33, 19, 38, 0.9)',
            border: '1px solid rgba(246, 200, 95, 0.25)',
            borderRadius: '10px',
            padding: '6px 10px',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mins</div>
        </div>

        <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>:</span>

        <div
          style={{
            background: 'rgba(33, 19, 38, 0.9)',
            border: '1px solid rgba(246, 200, 95, 0.25)',
            borderRadius: '10px',
            padding: '6px 10px',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-coral)' }}>
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Secs</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

