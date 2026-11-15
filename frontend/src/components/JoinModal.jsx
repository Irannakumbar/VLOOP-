import React, { useState } from 'react';
import { X, Ticket, AlertTriangle, CheckCircle, ArrowRight, Wallet, Sparkles, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { giveawayAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const JoinModal = ({ giveaway, isOpen, onClose, onJoinSuccess }) => {
  const { user, refreshProfile, earnTokens } = useAuth();
  const { notify } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !giveaway) return null;

  const currentBalance = user?.walletBalances?.[giveaway.currency] || 0;
  const entryFee = giveaway.entryFee;
  const hasSufficient = currentBalance >= entryFee;
  const remainingBalance = currentBalance - entryFee;
  const deficit = entryFee - currentBalance;

  const handleConfirmJoin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Send join request to backend (backend authoritatively verifies balance, currency, fee, and duplicate state)
      const response = await giveawayAPI.join(giveaway.slug || giveaway._id, {
        entryFee: giveaway.entryFee,
        currency: giveaway.currency,
      });

      const result = response.data;
      setSuccessResult(result);
      await refreshProfile(); // Refresh authoritative balances in context

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B4A', '#F6C85F', '#3C9B76', '#FFF7EA'],
      });

      if (onJoinSuccess) {
        onJoinSuccess(result);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete participation entry');
      if (err.data?.insufficientBalance) {
        // Will reflect in state
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEarnMore = async () => {
    await earnTokens();
    setErrorMessage('');
  };

  const handleClose = () => {
    setSuccessResult(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="veloop-modal-backdrop" onClick={handleClose}>
      <div
        className="veloop-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px' }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {!successResult ? (
          <div>
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'rgba(246, 200, 95, 0.15)',
                  border: '1px solid rgba(246, 200, 95, 0.35)',
                  marginBottom: '10px',
                }}
              >
                <Ticket size={28} color="#F6C85F" />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Confirm Giveaway Entry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
                {giveaway.title}
              </p>
            </div>

            {/* Error or Warning Banner */}
            {errorMessage && (
              <div
                style={{
                  background: 'rgba(255, 107, 74, 0.12)',
                  border: '1px solid rgba(255, 107, 74, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  color: '#FF876D',
                  fontSize: '0.88rem',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <AlertTriangle size={20} color="#FF6B4A" style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Balance Breakdown Table */}
            <div
              style={{
                background: 'rgba(33, 19, 38, 0.9)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(246, 200, 95, 0.2)',
                padding: '18px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Required Entry Fee:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-coral)' }}>
                  {entryFee.toLocaleString()} {giveaway.currency}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Wallet Balance:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                  {currentBalance.toLocaleString()} {giveaway.currency}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(246, 200, 95, 0.15)',
                  fontSize: '0.95rem',
                }}
              >
                <span style={{ fontWeight: 600 }}>Balance After Joining:</span>
                <span
                  style={{
                    fontWeight: 800,
                    color: hasSufficient ? 'var(--accent-emerald)' : '#FF6B4A',
                  }}
                >
                  {hasSufficient
                    ? `${remainingBalance.toLocaleString()} ${giveaway.currency}`
                    : `Deficit: -${deficit.toLocaleString()} ${giveaway.currency}`}
                </span>
              </div>
            </div>

            {/* Insufficient Balance Action */}
            {!hasSufficient ? (
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    background: 'rgba(255, 107, 74, 0.1)',
                    border: '1px solid rgba(255, 107, 74, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  You do not have enough {giveaway.currency}. You need{' '}
                  <strong style={{ color: '#FF6B4A' }}>
                    {deficit.toLocaleString()} more {giveaway.currency}
                  </strong>{' '}
                  to participate in this giveaway.
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleEarnMore}
                    className="btn-veloop-secondary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    <Coins size={18} />
                    Earn More Free Tokens
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-veloop-outline"
                    style={{ padding: '12px 20px' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Sufficient Balance: Action Buttons */
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-veloop-outline"
                  style={{ flex: 1, padding: '12px' }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmJoin}
                  disabled={isSubmitting}
                  className="btn-veloop-primary"
                  style={{ flex: 2, padding: '12px' }}
                >
                  {isSubmitting ? (
                    'Confirming Entry...'
                  ) : (
                    <>
                      <span>Confirm & Deduct</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '16px',
                borderRadius: '50%',
                background: 'rgba(60, 155, 118, 0.18)',
                border: '1px solid rgba(60, 155, 118, 0.5)',
                marginBottom: '16px',
              }}
            >
              <CheckCircle size={44} color="#3C9B76" />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
              Entry Confirmed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              You are officially registered for the <strong>{giveaway.title}</strong>!
            </p>

            {/* Generated VIP Ticket Display */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(50, 29, 53, 0.95) 0%, rgba(33, 19, 38, 0.95) 100%)',
                border: '2px dashed rgba(246, 200, 95, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '24px',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Official VIP Entry Ticket
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.7rem',
                  fontWeight: 900,
                  color: 'var(--accent-gold)',
                  letterSpacing: '0.05em',
                  margin: '8px 0',
                }}
              >
                {successResult.ticketNumber}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Entry Fee: {giveaway.entryFee} {giveaway.currency} • Authoritative Ledger Recorded
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="btn-veloop-primary"
              style={{ width: '100%', padding: '13px' }}
            >
              Done & View Giveaway
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinModal;
