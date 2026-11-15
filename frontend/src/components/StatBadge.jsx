import React from 'react';

export const StatBadge = ({ icon: Icon, value, label, sublabel, accent = 'gold' }) => {
  const getAccentColors = () => {
    switch (accent) {
      case 'coral':
        return {
          bg: 'rgba(255, 107, 74, 0.12)',
          border: 'rgba(255, 107, 74, 0.3)',
          iconColor: '#FF6B4A',
          textColor: 'var(--accent-coral)',
        };
      case 'emerald':
        return {
          bg: 'rgba(60, 155, 118, 0.12)',
          border: 'rgba(60, 155, 118, 0.3)',
          iconColor: '#3C9B76',
          textColor: '#55d4a4',
        };
      default:
        return {
          bg: 'rgba(246, 200, 95, 0.12)',
          border: 'rgba(246, 200, 95, 0.3)',
          iconColor: '#F6C85F',
          textColor: 'var(--accent-gold)',
        };
    }
  };

  const colors = getAccentColors();

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.8) 0%, rgba(33, 19, 38, 0.9) 100%)',
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={26} color={colors.iconColor} />
      </div>

      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem',
            fontWeight: 800,
            color: colors.textColor,
            lineHeight: 1.1,
            margin: '2px 0',
          }}
        >
          {value}
        </div>
        {sublabel && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatBadge;
