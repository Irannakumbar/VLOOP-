import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Gift,
  Users,
  Award,
  AlertTriangle,
  FileText,
  PlusCircle,
  CheckCircle2,
  RefreshCw,
  Truck,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import VeloopLoader from '../components/VeloopLoader';

export const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('giveaways');
  const [metrics, setMetrics] = useState(null);
  const [giveaways, setGiveaways] = useState([]);
  const [claims, setClaims] = useState([]);
  const [fraudEvents, setFraudEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Giveaway Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEntryFee, setNewEntryFee] = useState(250);
  const [newCurrency, setNewCurrency] = useState('VEs');
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newPrizeType, setNewPrizeType] = useState('physical');
  const [newRetailValue, setNewRetailValue] = useState(10000);
  const [newPrizeImage, setNewPrizeImage] = useState('/assets/prize-iphone-15-pro.png');
  const [newWinnerCount, setNewWinnerCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Claim fulfillment state
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [courierPartner, setCourierPartner] = useState('BlueDart Express');
  const [trackingCode, setTrackingCode] = useState('');
  const [voucherCode, setVoucherCode] = useState('');

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [metricsRes, gwRes, claimsRes, fraudRes, logsRes] = await Promise.all([
        adminAPI.getMetrics(),
        adminAPI.getGiveaways(),
        adminAPI.getClaims(),
        adminAPI.getFraudEvents(),
        adminAPI.getAuditLogs(),
      ]);

      if (metricsRes?.data) setMetrics(metricsRes.data);
      if (gwRes?.data?.giveaways) setGiveaways(gwRes.data.giveaways);
      if (claimsRes?.data?.claims) setClaims(claimsRes.data.claims);
      if (fraudRes?.data?.events) setFraudEvents(fraudRes.data.events);
      if (logsRes?.data?.logs) setAuditLogs(logsRes.data.logs);
    } catch (err) {
      console.error('Admin API error:', err);
      notify.error(err.message || 'Unauthorized: Admin privileges required.');
      if (err.status === 403 || err.status === 401) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      notify.error('Access restricted to VELOOP Administrators only.');
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [isAuthenticated, user]);

  const handleDrawWinners = async (giveawayId) => {
    if (!window.confirm('Are you ready to run the provably fair random draw and finalize winners?')) {
      return;
    }
    try {
      const res = await adminAPI.drawWinners(giveawayId);
      notify.success(res.message || 'Winners drawn successfully!');
      fetchAdminData();
    } catch (err) {
      notify.error(err.message || 'Failed to draw winners');
    }
  };

  const handleCreateGiveaway = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminAPI.createGiveaway({
        title: newTitle,
        description: newDescription,
        entryFee: Number(newEntryFee),
        currency: newCurrency,
        prizeName: newPrizeName || newTitle,
        prizeType: newPrizeType,
        retailValue: Number(newRetailValue),
        prizeImage: newPrizeImage,
        winnerCount: Number(newWinnerCount),
      });

      notify.success('New Giveaway created successfully!');
      setNewTitle('');
      setNewDescription('');
      fetchAdminData();
      setActiveTab('giveaways');
    } catch (err) {
      notify.error(err.message || 'Failed to create giveaway');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClaimStatus = async (claimId, status) => {
    try {
      await adminAPI.updateClaimStatus(claimId, {
        status,
        courierPartner: courierPartner || 'BlueDart Express',
        trackingCode: trackingCode || `TRK-${Date.now().toString().slice(-6)}`,
        voucherCode: voucherCode || `VOUCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });
      notify.success(`Claim updated to ${status}`);
      setSelectedClaimId(null);
      fetchAdminData();
    } catch (err) {
      notify.error(err.message || 'Failed to update claim');
    }
  };

  if (isLoading) {
    return <VeloopLoader message="Authenticating Administrator Console..." />;
  }

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-veloop-emerald">
                <Shield size={14} /> ADMINISTRATOR PORTAL
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Authenticated as: {user?.email}
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '6px' }}>
              Platform Control Suite
            </h1>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            className="btn-veloop-outline"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} />
            <span>Sync Ledger Data</span>
          </button>
        </div>

        {/* KPI Metrics Row */}
        {metrics && (
          <div className="row g-3 mb-4">
            <div className="col-md-2 col-sm-6">
              <div
                style={{
                  background: 'rgba(50, 29, 53, 0.85)',
                  border: '1px solid rgba(246, 200, 95, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Registered Users
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {metrics.totalUsers}
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-6">
              <div
                style={{
                  background: 'rgba(50, 29, 53, 0.85)',
                  border: '1px solid rgba(246, 200, 95, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Active Draws
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-coral)' }}>
                  {metrics.activeGiveaways}
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-6">
              <div
                style={{
                  background: 'rgba(50, 29, 53, 0.85)',
                  border: '1px solid rgba(246, 200, 95, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Entries Logged
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {metrics.totalParticipations}
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-6">
              <div
                style={{
                  background: 'rgba(50, 29, 53, 0.85)',
                  border: '1px solid rgba(246, 200, 95, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Pending Claims
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#55d4a4' }}>
                  {metrics.pendingClaims}
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-6">
              <div
                style={{
                  background: 'rgba(50, 29, 53, 0.85)',
                  border: '1px solid rgba(255, 107, 74, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Fraud Signals
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FF6B4A' }}>
                  {metrics.fraudEventsCount}
                </div>
              </div>
            </div>

            <div className="col-md-2 col-sm-6">
              <div
                style={{
                  background: 'rgba(50, 29, 53, 0.85)',
                  border: '1px solid rgba(246, 200, 95, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Catalog
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {metrics.totalGiveaways}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '28px',
            borderBottom: '1px solid rgba(246, 200, 95, 0.2)',
            paddingBottom: '12px',
          }}
        >
          {[
            { id: 'giveaways', label: 'Giveaways & Draws', icon: Gift },
            { id: 'create', label: 'Create Giveaway', icon: PlusCircle },
            { id: 'claims', label: 'Manage Claims', icon: Award },
            { id: 'fraud', label: 'Fraud & Security', icon: AlertTriangle },
            { id: 'audit', label: 'Audit Trail', icon: FileText },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: isActive ? 'var(--grad-coral)' : 'rgba(50, 29, 53, 0.7)',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <TabIcon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: GIVEAWAYS LIST & DRAW WINNERS ENGINE
            ========================================================================= */}
        {activeTab === 'giveaways' && (
          <div
            style={{
              background: 'rgba(50, 29, 53, 0.7)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Giveaway Catalog & Draws</h3>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="btn-veloop-secondary"
                style={{ padding: '8px 16px', fontSize: '0.84rem' }}
              >
                <PlusCircle size={16} /> Add New Giveaway
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th>Prize & Giveaway</th>
                    <th>Fee & Currency</th>
                    <th>Status</th>
                    <th>Participants</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.88rem' }}>
                  {giveaways.map((gw) => (
                    <tr key={gw._id} style={{ verticalAlign: 'middle' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={gw.prize?.image || '/assets/hero-gift-box.png'}
                            alt={gw.title}
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                          <div>
                            <strong style={{ color: '#FFFFFF' }}>{gw.title}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Slug: /{gw.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            gw.currency === 'VEs'
                              ? 'currency-pill ves'
                              : gw.currency === 'SVEs'
                              ? 'currency-pill sves'
                              : 'currency-pill tokens'
                          }
                        >
                          {gw.entryFee} {gw.currency}
                        </span>
                      </td>
                      <td>
                        <span
                          className={gw.status === 'active' ? 'badge-veloop-emerald' : 'badge-veloop-gold'}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {gw.status}
                        </span>
                      </td>
                      <td>{(gw.totalParticipants || 0).toLocaleString()} Users</td>
                      <td>{new Date(gw.endDate).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {gw.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => handleDrawWinners(gw._id)}
                              className="btn-veloop-primary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                            >
                              <Sparkles size={14} /> Draw Winner
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => navigate(`/giveaway/${gw.slug}`)}
                            className="btn-veloop-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CREATE GIVEAWAY FORM
            ========================================================================= */}
        {activeTab === 'create' && (
          <div
            style={{
              background: 'rgba(50, 29, 53, 0.7)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              maxWidth: '800px',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
              Create New VELOOP Giveaway & Prize
            </h3>

            <form onSubmit={handleCreateGiveaway} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="row g-3">
                <div className="col-md-8 veloop-input-group">
                  <label>Giveaway Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony PlayStation 5 Slim"
                    className="veloop-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="col-md-4 veloop-input-group">
                  <label>Prize Type</label>
                  <select
                    className="veloop-input"
                    value={newPrizeType}
                    onChange={(e) => setNewPrizeType(e.target.value)}
                  >
                    <option value="physical">Physical Product</option>
                    <option value="digital">Digital Voucher / Code</option>
                  </select>
                </div>
              </div>

              <div className="veloop-input-group">
                <label>Description & Promotional Text</label>
                <textarea
                  required
                  rows={3}
                  className="veloop-input"
                  placeholder="Enter detailed description of the reward and eligibility criteria..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="row g-3">
                <div className="col-md-4 veloop-input-group">
                  <label>Entry Fee</label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="veloop-input"
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(e.target.value)}
                  />
                </div>

                <div className="col-md-4 veloop-input-group">
                  <label>Currency Type</label>
                  <select
                    className="veloop-input"
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                  >
                    <option value="VEs">VEs (Standard Credits)</option>
                    <option value="SVEs">SVEs (Special VEs)</option>
                    <option value="Tokens">Tokens (Daily Micro Drop)</option>
                  </select>
                </div>

                <div className="col-md-4 veloop-input-group">
                  <label>Number of Winners</label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="veloop-input"
                    value={newWinnerCount}
                    onChange={(e) => setNewWinnerCount(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6 veloop-input-group">
                  <label>Retail Valuation (INR)</label>
                  <input
                    type="number"
                    required
                    className="veloop-input"
                    value={newRetailValue}
                    onChange={(e) => setNewRetailValue(e.target.value)}
                  />
                </div>

                <div className="col-md-6 veloop-input-group">
                  <label>Supplied Prize Asset Image Path</label>
                  <select
                    className="veloop-input"
                    value={newPrizeImage}
                    onChange={(e) => setNewPrizeImage(e.target.value)}
                  >
                    <option value="/assets/prize-iphone-15-pro.png">iPhone 15 Pro Deep Purple</option>
                    <option value="/assets/prize-apple-watch.png">Apple Watch Series 9</option>
                    <option value="/assets/prize-airpods.png">AirPods Pro 2</option>
                    <option value="/assets/prize-amazon-2000.png">Amazon Gift Card ₹2,000</option>
                    <option value="/assets/prize-amazon-500.png">Amazon Gift Card ₹500</option>
                    <option value="/assets/prize-amazon-20.png">Amazon Shopping ₹20</option>
                    <option value="/assets/podium-gift-box.png">Podium Luxury Box</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-veloop-primary"
                style={{ marginTop: '12px', padding: '14px' }}
              >
                {isSubmitting ? 'Creating Giveaway...' : 'Publish Giveaway to Platform'}
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 3: MANAGE CLAIMS & FULFILLMENT
            ========================================================================= */}
        {activeTab === 'claims' && (
          <div
            style={{
              background: 'rgba(50, 29, 53, 0.7)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
              Prize Claims Fulfillment Queue
            </h3>

            {claims.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-hover" style={{ backgroundColor: 'transparent' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th>Winner</th>
                      <th>Prize</th>
                      <th>Type</th>
                      <th>Delivery Destination</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.86rem' }}>
                    {claims.map((claim) => (
                      <tr key={claim._id} style={{ verticalAlign: 'middle' }}>
                        <td>
                          <strong>{claim.userId?.name || 'Winner User'}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {claim.userId?.email}
                          </div>
                        </td>
                        <td>{claim.prizeId?.name || 'Won Prize'}</td>
                        <td>
                          <span className="badge-veloop-gold">{claim.claimType}</span>
                        </td>
                        <td style={{ maxWidth: '240px' }}>
                          {claim.claimType === 'physical' ? (
                            <span style={{ fontSize: '0.8rem' }}>
                              {claim.physicalDetails?.address}, {claim.physicalDetails?.city} - {claim.physicalDetails?.pinCode}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#55d4a4' }}>
                              {claim.digitalDetails?.email}
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className={
                              claim.status === 'completed'
                                ? 'badge-veloop-emerald'
                                : claim.status === 'processing'
                                ? 'badge-veloop-gold'
                                : 'badge-veloop-coral'
                            }
                          >
                            {claim.status}
                          </span>
                        </td>
                        <td>
                          {claim.status !== 'completed' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleUpdateClaimStatus(claim._id, 'processing')}
                                className="btn-veloop-outline"
                                style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                              >
                                Dispatch
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateClaimStatus(claim._id, 'completed')}
                                className="btn-veloop-primary"
                                style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                              >
                                Complete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No submitted claims currently in queue.
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: FRAUD & SECURITY SIGNALS
            ========================================================================= */}
        {activeTab === 'fraud' && (
          <div
            style={{
              background: 'rgba(50, 29, 53, 0.7)',
              border: '1px solid rgba(255, 107, 74, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', color: '#FF6B4A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} /> Fraud & Anomaly Detections
            </h3>

            {fraudEvents.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-hover" style={{ backgroundColor: 'transparent' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th>Event Type</th>
                      <th>Risk Score</th>
                      <th>User Account</th>
                      <th>IP & Details</th>
                      <th>Action Taken</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.86rem' }}>
                    {fraudEvents.map((event) => (
                      <tr key={event._id} style={{ verticalAlign: 'middle' }}>
                        <td>
                          <span className="badge-veloop-coral">{event.eventType}</span>
                        </td>
                        <td>
                          <strong style={{ color: event.riskScore >= 50 ? '#FF6B4A' : 'var(--accent-gold)' }}>
                            {event.riskScore} / 100
                          </strong>
                        </td>
                        <td>{event.userId?.email || 'Unauthenticated Guest'}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          IP: {event.ipAddress || '127.0.0.1'}
                        </td>
                        <td>
                          <span className="badge-veloop-emerald">{event.mitigationAction}</span>
                        </td>
                        <td>{new Date(event.createdAt).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Zero suspicious fraud events detected. Platform security intact.
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: AUDIT LOGS
            ========================================================================= */}
        {activeTab === 'audit' && (
          <div
            style={{
              background: 'rgba(50, 29, 53, 0.7)',
              border: '1px solid rgba(246, 200, 95, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
              Administrative Audit Trail
            </h3>

            {auditLogs.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-hover" style={{ backgroundColor: 'transparent' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th>Action</th>
                      <th>Target Model</th>
                      <th>Actor</th>
                      <th>IP Address</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.86rem' }}>
                    {auditLogs.map((log) => (
                      <tr key={log._id} style={{ verticalAlign: 'middle' }}>
                        <td>
                          <strong style={{ color: 'var(--accent-gold)' }}>{log.action}</strong>
                        </td>
                        <td>{log.targetModel}</td>
                        <td>{log.actorId?.name || log.actorId?.email || 'Admin'}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {log.ipAddress || 'internal'}
                        </td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No audit entries recorded yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

