import React from 'react';
import { Sparkles } from 'lucide-react';

export const VeloopLoader = ({ message = 'Loading VELOOP Rewards...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        minHeight: '320px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulsing ambient rings in coral & gold */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(255, 107, 74, 0.3)',
            animation: 'pulseGlow 2s infinite ease-in-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(246, 200, 95, 0.4)',
            animation: 'spinSlow 12s infinite linear',
          }}
        />

        {/* 3D Gift Box image centered */}
        <img
          src="/assets/hero-gift-box.png"
          alt="VELOOP Loading"
          style={{
            width: '84px',
            height: '84px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.6))',
            animation: 'floatSlow 2.5s infinite ease-in-out',
          }}
        />

        {/* Floating sparkles */}
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            right: '5px',
            animation: 'pulseGlow 1.8s infinite ease-in-out',
          }}
        >
          <Sparkles size={20} color="#F6C85F" />
        </div>
      </div>

      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--accent-gold)',
            letterSpacing: '0.02em',
          }}
        >
          {message}
        </p>
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'inline-block',
            marginTop: '4px',
          }}
        >
          Authoritative Rewards Ledger Synced
        </span>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VeloopLoader;

