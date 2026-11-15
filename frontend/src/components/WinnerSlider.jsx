import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Gift, ArrowRight } from 'lucide-react';

const defaultWinnerMessages = [
  { id: '1', user: 'VE****21', prize: 'iPhone 15 Pro 128GB', time: '10 mins ago', type: 'Grand Prize' },
  { id: '2', user: 'VE****83', prize: 'Apple Watch Series 9', time: '25 mins ago', type: '2nd Prize' },
  { id: '3', user: 'VE****54', prize: 'AirPods Pro 2', time: '42 mins ago', type: '3rd Prize' },
  { id: '4', user: 'VE****92', prize: '₹2,000 Amazon Gift Card', time: '1 hour ago', type: 'Lucky Draw' },
  { id: '5', user: 'VE****19', prize: '₹500 Amazon Gift Card', time: '2 hours ago', type: 'Popular Draw' },
  { id: '6', user: 'VE****77', prize: '₹20 Amazon Voucher Daily Drop', time: '3 hours ago', type: 'Daily Drop' },
];

export const WinnerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % defaultWinnerMessages.length);
    }, 3800); // Rotate smoothly every 3.8 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const current = defaultWinnerMessages[currentIndex];

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(50, 29, 53, 0.95) 0%, rgba(33, 19, 38, 0.98) 50%, rgba(50, 29, 53, 0.95) 100%)',
        borderTop: '1px solid rgba(246, 200, 95, 0.25)',
        borderBottom: '1px solid rgba(246, 200, 95, 0.25)',
        padding: '12px 20px',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Social Proof Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="badge-veloop-gold"
            style={{ fontSize: '0.74rem', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            <Trophy size={13} color="#F6C85F" />
            LIVE WINNER FEED
          </span>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }} className="d-none d-md-inline">
            (Updates in real-time)
          </span>
        </div>

        {/* Animated Message Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '280px',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <div
            key={current.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'fadeInSlide 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Sparkles size={16} color="#FF6B4A" />
            <span style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>
              User <strong style={{ color: 'var(--accent-gold)' }}>{current.user}</strong> just won{' '}
              <strong style={{ color: 'var(--accent-coral)' }}>{current.prize}</strong>!
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'rgba(33, 19, 38, 0.7)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(246, 200, 95, 0.15)',
              }}
              className="d-none d-sm-inline"
            >
              {current.time}
            </span>
          </div>
        </div>

        {/* Indicator Dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {defaultWinnerMessages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              style={{
                width: currentIndex === i ? '18px' : '6px',
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: currentIndex === i ? 'var(--accent-coral)' : 'rgba(246, 200, 95, 0.25)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to winner announcement ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default WinnerSlider;
