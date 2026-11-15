import React, { useState } from 'react';
import { X, Award, MapPin, Mail, Phone, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { claimAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const ClaimModal = ({ giveaway, winnerRecord, isOpen, onClose, onClaimSuccess }) => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const isPhysical = giveaway?.prize?.type === 'physical';

  // Physical Form State prefilled with user shipping address if present
  const [fullName, setFullName] = useState(user?.shippingAddress?.fullName || user?.name || '');
  const [phone, setPhone] = useState(user?.shippingAddress?.phone || user?.phone || '');
  const [address, setAddress] = useState(user?.shippingAddress?.address || '');
  const [city, setCity] = useState(user?.shippingAddress?.city || '');
  const [stateName, setStateName] = useState(user?.shippingAddress?.state || '');
  const [pinCode, setPinCode] = useState(user?.shippingAddress?.pinCode || '');

  // Digital Form State
  const [digitalEmail, setDigitalEmail] = useState(user?.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  if (!isOpen || !giveaway) return null;

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const claimPayload = {
        claimType: isPhysical ? 'physical' : 'digital',
      };

      if (isPhysical) {
        if (!fullName || !phone || !address || !city || !stateName || !pinCode) {
          throw new Error('Please fill out all shipping fields.');
        }
        claimPayload.physicalDetails = {
          fullName,
          phone,
          address,
          city,
          state: stateName,
          pinCode,
        };
      } else {
        if (!digitalEmail) {
          throw new Error('Please provide a valid delivery email address.');
        }
        claimPayload.digitalDetails = {
          email: digitalEmail,
        };
      }

      await claimAPI.claimPrize(giveaway.slug || giveaway._id, claimPayload);
      setClaimSubmitted(true);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#3C9B76', '#F6C85F', '#FF6B4A', '#FFFFFF'],
      });

      notify.success('Claim submitted! Your prize is now queued for verification and dispatch.');
      if (onClaimSuccess) onClaimSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="veloop-modal-backdrop" onClick={onClose}>
      <div
        className="veloop-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px', maxWidth: '580px' }}
      >
        <button
          onClick={onClose}
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

        {!claimSubmitted ? (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'rgba(60, 155, 118, 0.18)',
                  border: '1px solid rgba(60, 155, 118, 0.4)',
                  marginBottom: '10px',
                }}
              >
                <Award size={30} color="#3C9B76" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Claim Your Reward</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                {giveaway.prize?.name || giveaway.title}
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  background: 'rgba(255, 107, 74, 0.12)',
                  border: '1px solid rgba(255, 107, 74, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: '#FF876D',
                  fontSize: '0.86rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitClaim} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isPhysical ? (
                /* Physical Prize Shipping Details */
                <>
                  <div
                    style={{
                      background: 'rgba(246, 200, 95, 0.08)',
                      border: '1px solid rgba(246, 200, 95, 0.2)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      color: 'var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <MapPin size={16} />
                    <span>Physical Prize: Please provide an accurate postal delivery address.</span>
                  </div>

                  <div className="row g-2">
                    <div className="col-md-6 veloop-input-group">
                      <label>Recipient Full Name</label>
                      <input
                        type="text"
                        required
                        className="veloop-input"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 veloop-input-group">
                      <label>Contact Phone Number</label>
                      <input
                        type="tel"
                        required
                        className="veloop-input"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="veloop-input-group">
                    <label>Street Address / Flat No.</label>
                    <textarea
                      required
                      rows={2}
                      className="veloop-input"
                      placeholder="House / Apartment, Street, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-md-4 veloop-input-group">
                      <label>City</label>
                      <input
                        type="text"
                        required
                        className="veloop-input"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 veloop-input-group">
                      <label>State</label>
                      <input
                        type="text"
                        required
                        className="veloop-input"
                        placeholder="State"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 veloop-input-group">
                      <label>PIN Code</label>
                      <input
                        type="text"
                        required
                        className="veloop-input"
                        placeholder="e.g. 560038"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Digital Gift Card Delivery Details */
                <>
                  <div
                    style={{
                      background: 'rgba(246, 200, 95, 0.08)',
                      border: '1px solid rgba(246, 200, 95, 0.2)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      color: 'var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Mail size={16} />
                    <span>Digital Voucher: Your code will be dispatched to the verified email address.</span>
                  </div>

                  <div className="veloop-input-group">
                    <label>Delivery Email Address</label>
                    <input
                      type="email"
                      required
                      className="veloop-input"
                      placeholder="you@domain.com"
                      value={digitalEmail}
                      onChange={(e) => setDigitalEmail(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                }}
              >
                <Shield size={14} color="#3C9B76" />
                <span>Encrypted transmission. Your shipping info is private and never shown publicly.</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-veloop-outline"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-veloop-primary"
                  style={{ flex: 2, padding: '12px' }}
                >
                  {isSubmitting ? 'Submitting Claim...' : 'Confirm Claim Submission'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
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
              <CheckCircle2 size={44} color="#3C9B76" />
            </div>

            <h3 style={{ fontSize: '1.55rem', fontWeight: 800, marginBottom: '8px' }}>
              Claim Received!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Your claim details have been securely logged. Our team is processing fulfillment.
            </p>

            <div
              style={{
                background: 'rgba(33, 19, 38, 0.9)',
                border: '1px solid rgba(60, 155, 118, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '22px',
                textAlign: 'left',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Claim Status:</div>
              <div style={{ fontWeight: 700, color: '#55d4a4', fontSize: '1rem', marginBottom: '8px' }}>
                Claim Submitted & Pending Dispatch
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {isPhysical
                  ? `Delivery to: ${fullName}, ${city}, ${stateName} - ${pinCode}`
                  : `Digital Voucher delivery to: ${digitalEmail}`}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-veloop-primary"
              style={{ width: '100%', padding: '13px' }}
            >
              View My Claim Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimModal;
