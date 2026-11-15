import React, { useState, useEffect } from 'react';
import { Award, Sparkles, ShieldCheck, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { giveawayAPI } from '../services/api';
import VeloopLoader from '../components/VeloopLoader';

export const WinnersPage = () => {
  const [winners, setWinners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setIsLoading(true);
        const res = await giveawayAPI.getPreviousWinners();
        if (res?.data?.winners) {
          setWinners(res.data.winners);
        }
      } catch (err) {
        console.error('Error fetching winners:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWinners();
  }, []);

  if (isLoading) {
    return <VeloopLoader message="Loading Verified Winners Ledger..." />;
  }

  const filteredWinners = winners.filter((w) => {
    const prizeName = w.prize?.name?.toLowerCase() || '';
    const maskedId = w.maskedUserId?.toLowerCase() || '';
    const matchesSearch =
      prizeName.includes(searchTerm.toLowerCase()) || maskedId.includes(searchTerm.toLowerCase());

    if (filterType === 'physical') {
      return matchesSearch && w.prize?.type === 'physical';
    }
    if (filterType === 'digital') {
      return matchesSearch && w.prize?.type === 'digital';
    }
    return matchesSearch;
  });

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
          <span className="badge-veloop-gold" style={{ marginBottom: '12px' }}>
            HALL OF WINNERS
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900 }}>
            Official Winner Roster
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
            Every winner is selected transparently with cryptographic SHA-256 entropy.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(50, 29, 53, 0.75)',
            border: '1px solid rgba(246, 200, 95, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '32px',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search by prize or masked ID..."
              className="veloop-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', paddingRight: '16px' }}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'btn-veloop-primary' : 'btn-veloop-outline'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              All Rewards ({winners.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('physical')}
              className={filterType === 'physical' ? 'btn-veloop-primary' : 'btn-veloop-outline'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              Physical Gadgets
            </button>
            <button
              type="button"
              onClick={() => setFilterType('digital')}
              className={filterType === 'digital' ? 'btn-veloop-primary' : 'btn-veloop-outline'}
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              Digital Vouchers
            </button>
          </div>
        </div>

        {/* Winners Grid */}
        {filteredWinners.length > 0 ? (
          <div className="row g-4">
            {filteredWinners.map((winner) => (
              <div key={winner._id} className="col-lg-4 col-md-6">
                <div
                  style={{
                    background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.85) 0%, rgba(33, 19, 38, 0.95) 100%)',
                    border: '1px solid rgba(246, 200, 95, 0.22)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div
                    style={{
                      height: '110px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <img
                      src={winner.prize?.image || '/assets/hero-gift-box.png'}
                      alt={winner.prize?.name}
                      style={{
                        maxHeight: '100px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.5))',
                      }}
                    />
                  </div>

                  <span className="badge-veloop-gold" style={{ fontSize: '0.74rem', marginBottom: '8px' }}>
                    <Sparkles size={12} />
                    Rank #{winner.rank} Winner
                  </span>

                  <h4 style={{ fontSize: '1.18rem', fontWeight: 800, marginBottom: '6px' }}>
                    {winner.prize?.name || 'Exclusive Prize'}
                  </h4>

                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--accent-coral)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      marginBottom: '8px',
                    }}
                  >
                    {winner.maskedUserId}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Drawn: {new Date(winner.announcedAt).toLocaleDateString()}
                  </div>

                  <div style={{ marginTop: 'auto', width: '100%' }}>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(33, 19, 38, 0.8)',
                        border: '1px solid rgba(246, 200, 95, 0.15)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>Claim Status:</span>
                      <strong
                        style={{
                          color:
                            winner.claimStatus === 'claim_completed'
                              ? '#55d4a4'
                              : 'var(--accent-gold)',
                        }}
                      >
                        {winner.claimStatus === 'claim_completed'
                          ? 'Delivered'
                          : winner.claimStatus === 'claim_processing'
                          ? 'In Transit'
                          : 'Claim Logged'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'rgba(50, 29, 53, 0.5)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <Award size={40} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
            <h4>No Winners Found</h4>
            <p style={{ color: 'var(--text-muted)' }}>
              No winners matched your search criteria. Try clearing the filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnersPage;
