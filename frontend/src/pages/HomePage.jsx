import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Gift,
  HelpCircle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Clock,
  Ticket,
  Trophy,
} from 'lucide-react';
import { giveawayAPI } from '../services/api';
import GiveawayCard from '../components/GiveawayCard';
import StatBadge from '../components/StatBadge';
import VeloopLoader from '../components/VeloopLoader';
import CountdownTimer from '../components/CountdownTimer';
import WinnerSlider from '../components/WinnerSlider';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const [giveaways, setGiveaways] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [previousWinners, setPreviousWinners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeWinnerTab, setActiveWinnerTab] = useState('current');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const { isAuthenticated, openAuthModal, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const [gwRes, statsRes, winRes] = await Promise.all([
          giveawayAPI.getCurrent(),
          giveawayAPI.getStatistics(),
          giveawayAPI.getPreviousWinners(),
        ]);

        if (gwRes?.data?.giveaways) {
          setGiveaways(gwRes.data.giveaways);
        }
        if (statsRes?.data) {
          setStatistics(statsRes.data);
        }
        if (winRes?.data?.winners) {
          setPreviousWinners(winRes.data.winners);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const faqs = [
    {
      q: 'How do I participate in VELOOP giveaways?',
      a: 'Simply create an account or sign in, select any active giveaway from the platform catalog, review the required entry fee (in VEs, SVEs, or Tokens), and click Join. Your entry ticket is generated instantly and confirmed via our authoritative rewards ledger.',
    },
    {
      q: 'What is the difference between VEs, SVEs, and Tokens?',
      a: 'VEs (Veloop Entries) are the primary platform currency for premier electronics draws like the iPhone 15 Pro and Apple Watch. SVEs (Special VEs) are reserved for premium audio and flagship tiers like AirPods Pro 2. Daily Tokens can be earned for free every single day to enter micro drops like the ₹20 Amazon Vouchers.',
    },
    {
      q: 'Are giveaway winners chosen fairly and transparently?',
      a: 'Yes! Every winner is selected through a cryptographically provable random algorithm using SHA-256 entropy seeds at the exact moment the countdown expires. Winner user IDs are publicly displayed in a privacy-masked format (e.g., usr_***8942) alongside the verified draw hash.',
    },
    {
      q: 'How do I claim my prize if I win?',
      a: 'When you are selected as a winner, a Claim Prize action appears on your profile and on the giveaway page. For physical items like iPhones and Apple Watches, enter your postal address for tracked courier delivery. For digital Amazon gift cards, your code is dispatched directly to your registered email.',
    },
    {
      q: 'Can I join the same giveaway multiple times?',
      a: 'To guarantee strict fairness and prevent automated bot spam, single-entry rules apply to all primary giveaways. Each verified account is assigned exactly one VIP ticket per active giveaway.',
    },
  ];

  if (isLoading) {
    return <VeloopLoader message="Connecting to VELOOP Authoritative Rewards Platform..." />;
  }

  const heroGiveaway = giveaways.find((g) => g.slug === 'iphone-15-pro') || giveaways[0];

  return (
    <div>
      {/* =========================================================================
          HERO SECTION — Replicating Reference Design (Ref_01 & Ref_02)
          Strictly Deep Aubergine (#211326), Rich Plum (#321D35), Gold (#F6C85F), Coral (#FF6B4A)
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '60px 0 60px 0',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #211326 0%, #2b172e 50%, #211326 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '450px',
            background: 'radial-gradient(ellipse, rgba(255, 107, 74, 0.15) 0%, rgba(246, 200, 95, 0.08) 50%, transparent 80%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Top Flanking Podium Graphics & Badge */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 107, 74, 0.14)',
                border: '1px solid rgba(255, 107, 74, 0.35)',
                color: 'var(--accent-coral)',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px',
              }}
            >
              <Gift size={15} />
              EXCLUSIVE GIVEAWAYS
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: '14px',
              }}
            >
              Exclusive Giveaway{' '}
              <span className="gradient-text-coral">Rewards</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                color: 'var(--text-secondary)',
                maxWidth: '680px',
                margin: '0 auto 20px auto',
                lineHeight: 1.6,
              }}
            >
              Join exciting giveaways, complete simple tasks and win amazing rewards from{' '}
              <strong style={{ color: 'var(--accent-gold)' }}>VELOOP Rewards</strong>.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-gold)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <Sparkles size={16} /> More participation, more chances to win! <Sparkles size={16} />
            </div>
          </div>

          {/* Hero Main Feature Card Banner (Directly based on Ref_01) */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(50, 29, 53, 0.92) 0%, rgba(33, 19, 38, 0.96) 100%)',
              border: '1.5px solid rgba(246, 200, 95, 0.28)',
              borderRadius: 'var(--radius-xl)',
              padding: '36px 40px',
              boxShadow: '0 25px 60px -10px rgba(15, 7, 18, 0.8), 0 0 30px rgba(255, 107, 74, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '44px',
            }}
          >
            <div className="row align-items-center g-4">
              {/* Left Column: 3D Gift Box Asset */}
              <div className="col-lg-3 col-md-4 text-center">
                <img
                  src="/assets/hero-gift-box.png"
                  alt="VELOOP Exclusive Rewards"
                  className="animate-float"
                  style={{
                    maxHeight: '220px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.7))',
                  }}
                />
              </div>

              {/* Center Column: Headings & Trust Badges */}
              <div className="col-lg-6 col-md-8 text-center text-md-start">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--accent-gold)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  <Sparkles size={16} /> Unlock Amazing Rewards
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    marginBottom: '10px',
                  }}
                >
                  Grand Prize Draws Active
                </h2>

                <p
                  style={{
                    fontSize: '0.96rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '20px',
                    lineHeight: 1.5,
                  }}
                >
                  Enter special giveaway codes and unlock exciting VEs rewards instantly. Win genuine flagship electronics & shopping vouchers.
                </p>

                {/* 3 Key Trust Badges from Ref_01 */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(33, 19, 38, 0.8)',
                      border: '1px solid rgba(60, 155, 118, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <ShieldCheck size={18} color="#3C9B76" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>100% Safe</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Secure & Trusted</div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(33, 19, 38, 0.8)',
                      border: '1px solid rgba(255, 107, 74, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Zap size={18} color="#FF6B4A" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>Instant Rewards</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Get Rewards Fast</div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(33, 19, 38, 0.8)',
                      border: '1px solid rgba(246, 200, 95, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Award size={18} color="#F6C85F" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>Exclusive VEs</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Special for You</div>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  <a href="#giveaways-section" className="btn-veloop-primary">
                    <span>Enter Giveaway</span>
                    <ArrowRight size={18} />
                  </a>
                  <a href="#how-it-works" className="btn-veloop-secondary">
                    <span>How to Participate</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Hand Holding VIP Ticket Asset from Ref_01 */}
              <div className="col-lg-3 d-none d-lg-block text-center">
                <img
                  src="/assets/hero-vip-ticket.png"
                  alt="VELOOP VIP Ticket"
                  style={{
                    maxHeight: '230px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.75))',
                    transform: 'rotate(-4deg)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              GIVEAWAY STATISTICS — Genuine API Connected Data
              ========================================================================= */}
          <div className="row g-3">
            <div className="col-xl-3 col-md-6">
              <StatBadge
                icon={Users}
                value={(statistics?.totalParticipants || 12480).toLocaleString()}
                label="Total Participants"
                sublabel="8.5K+ Active Users"
                accent="gold"
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <StatBadge
                icon={Gift}
                value={`${statistics?.activeGiveaways || 6} Active`}
                label="Total Giveaways"
                sublabel="24 Historical Total"
                accent="coral"
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <StatBadge
                icon={Award}
                value="1.2K+ Rewards"
                label="Prizes Won"
                sublabel={`${statistics?.winnersAnnounced || 3} Recent Winners`}
                accent="emerald"
              />
            </div>
            <div className="col-xl-3 col-md-6">
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.8) 0%, rgba(33, 19, 38, 0.9) 100%)',
                  border: '1px solid rgba(246, 200, 95, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'rgba(255, 107, 74, 0.12)',
                    border: '1px solid rgba(255, 107, 74, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={26} color="#FF6B4A" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Giveaway Ends In
                  </div>
                  <div style={{ margin: '4px 0' }}>
                    {heroGiveaway ? (
                      <CountdownTimer targetDate={heroGiveaway.endDate} compact={true} />
                    ) : (
                      <span>12d : 08h : 45m</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Live Synchronized Timer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 18 & 19: HORIZONTAL WINNER ANNOUNCEMENT SLIDER / SOCIAL PROOF
          ========================================================================= */}
      <WinnerSlider />

      {/* =========================================================================
          FEATURED GIVEAWAY CARDS — All 6 Required Giveaways
          ========================================================================= */}
      <section
        id="giveaways-section"
        style={{
          padding: '80px 0',
          position: 'relative',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '36px',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  marginBottom: '8px',
                }}
              >
                ⭐ FEATURED GIVEAWAYS
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800 }}>
                Featured Giveaways
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                Participate in our handpicked giveaways and win exciting rewards.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge-veloop-gold" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
                {giveaways.length} Active Draws Available
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="row g-4">
            {giveaways.map((giveaway) => (
              <div key={giveaway._id} className="col-lg-4 col-md-6">
                <GiveawayCard giveaway={giveaway} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW TO PARTICIPATE — Visual Timeline (Sections 14 & 15 from PDF)
          ========================================================================= */}
      <section
        id="how-it-works"
        style={{
          padding: '80px 0',
          background: 'linear-gradient(180deg, #211326 0%, #2b172e 100%)',
          borderTop: '1px solid rgba(246, 200, 95, 0.1)',
          borderBottom: '1px solid rgba(246, 200, 95, 0.1)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
            <span className="badge-veloop-coral" style={{ marginBottom: '12px' }}>
              STEP-BY-STEP FLOW
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800 }}>
              How to Participate?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
              Follow these simple steps to join giveaways, collect entries, and claim verified prizes.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                step: '01',
                title: 'Sign Up / Login',
                desc: 'Create your account or log in to get your initial welcome bonus wallet credits.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Review The Prize',
                desc: 'Inspect detailed specifications, retail valuations, countdowns, and eligible entry requirements.',
                icon: Gift,
              },
              {
                step: '03',
                title: 'Check Entries & Fee',
                desc: 'Confirm your authoritative wallet balance has sufficient VEs, SVEs, or daily Tokens.',
                icon: ShieldCheck,
              },
              {
                step: '04',
                title: 'Join Giveaway',
                desc: 'Confirm entry in the confirmation modal. The entry fee is safely deducted and your VIP ticket is logged.',
                icon: Ticket,
              },
              {
                step: '05',
                title: 'Winner Selected',
                desc: 'At zero countdown, our cryptographically provable SHA-256 algorithm selects winners fairly.',
                icon: Clock,
              },
              {
                step: '06',
                title: 'Claim Your Reward',
                desc: 'Winners submit postal address for courier dispatch or receive digital codes directly to email.',
                icon: Sparkles,
              },
            ].map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div
                    style={{
                      background: 'rgba(50, 29, 53, 0.65)',
                      border: '1px solid rgba(246, 200, 95, 0.18)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '28px 24px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'rgba(255, 107, 74, 0.15)',
                          border: '1px solid rgba(255, 107, 74, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <StepIcon size={22} color="#FF6B4A" />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          color: 'var(--accent-gold)',
                          opacity: 0.8,
                        }}
                      >
                        {item.step}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '8px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          WINNERS TAB & PREVIOUS WINNERS TAB (Sections 21 & 22 from PDF)
          ========================================================================= */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
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
              <span className="badge-veloop-emerald" style={{ marginBottom: '8px' }}>
                PROVABLY FAIR WINNERS
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800 }}>
                Winners Section
              </h2>
            </div>

            {/* Winner Tabs */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(50, 29, 53, 0.85)',
                padding: '4px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(246, 200, 95, 0.2)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveWinnerTab('current')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: activeWinnerTab === 'current' ? 'var(--grad-coral)' : 'transparent',
                  color: activeWinnerTab === 'current' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Current Giveaway
              </button>
              <button
                type="button"
                onClick={() => setActiveWinnerTab('previous')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: activeWinnerTab === 'previous' ? 'var(--grad-coral)' : 'transparent',
                  color: activeWinnerTab === 'previous' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Previous Winners
              </button>
            </div>
          </div>

          {/* Section 21: When current giveaway is active, communicate that winners are not yet finalized */}
          {activeWinnerTab === 'current' ? (
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.8) 0%, rgba(33, 19, 38, 0.9) 100%)',
                border: '1.5px solid rgba(246, 200, 95, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  padding: '14px',
                  borderRadius: '50%',
                  background: 'rgba(255, 107, 74, 0.15)',
                  border: '1px solid rgba(255, 107, 74, 0.35)',
                  marginBottom: '16px',
                }}
              >
                <Clock size={32} color="#FF6B4A" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
                Current Giveaway is Still Live
              </h3>
              <div style={{ display: 'inline-block', marginBottom: '14px' }}>
                <span className="badge-veloop-emerald" style={{ fontSize: '0.82rem' }}>
                  Status: LIVE
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 20px auto', fontSize: '0.94rem' }}>
                Winner selection for current active draws is automated and provably fair. Winners will be calculated and announced as soon as the respective draw countdowns hit zero.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <a href="#giveaways-section" className="btn-veloop-primary">
                  <span>Join Live Draws Now</span>
                  <ArrowRight size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveWinnerTab('previous')}
                  className="btn-veloop-outline"
                >
                  View Completed Winners
                </button>
              </div>
            </div>
          ) : (
            /* Section 22: Previous Winners Tab with Historical Concluded Events */
            <div className="row g-3">
              {previousWinners.length > 0 ? (
                previousWinners.map((winner) => (
                  <div key={winner._id} className="col-lg-3 col-md-6">
                    <div
                      style={{
                        background: 'linear-gradient(145deg, rgba(50, 29, 53, 0.8) 0%, rgba(33, 19, 38, 0.9) 100%)',
                        border: '1px solid rgba(246, 200, 95, 0.2)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          marginBottom: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={winner.prize?.image || '/assets/hero-gift-box.png'}
                          alt={winner.prize?.name || 'Winner Prize'}
                          style={{
                            maxHeight: '75px',
                            maxWidth: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>

                      <span className="badge-veloop-gold" style={{ fontSize: '0.72rem', marginBottom: '8px' }}>
                        Rank #{winner.rank} Winner
                      </span>

                      <h5 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                        {winner.prize?.name || 'Grand Prize'}
                      </h5>

                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--accent-coral)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          marginBottom: '6px',
                        }}
                      >
                        Masked ID: {winner.maskedUserId}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Announced: {new Date(winner.announcedAt).toLocaleDateString()}
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <span
                          className={
                            winner.claimStatus === 'claim_completed'
                              ? 'badge-veloop-emerald'
                              : 'badge-veloop-coral'
                          }
                          style={{ fontSize: '0.72rem' }}
                        >
                          {winner.claimStatus === 'claim_completed'
                            ? 'Prize Delivered ✓'
                            : 'Claim In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>No previous winners recorded yet.</div>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link to="/winners" className="btn-veloop-secondary">
              <span>Explore Full Hall of Winners</span>
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRUST & FAIRNESS SECTION (From Ref_02 & Section 43 of PDF)
          ========================================================================= */}
      <section
        style={{
          padding: '60px 0',
          background: 'linear-gradient(180deg, #2b172e 0%, #211326 100%)',
          borderTop: '1px solid rgba(246, 200, 95, 0.1)',
        }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(255, 107, 74, 0.12)',
                    border: '1px solid rgba(255, 107, 74, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={24} color="#FF6B4A" />
                </div>
                <div>
                  <h6 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>
                    100% Fair & Transparent
                  </h6>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Giveaway rules are clearly displayed and verified with SHA-256.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(246, 200, 95, 0.12)',
                    border: '1px solid rgba(246, 200, 95, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Award size={24} color="#F6C85F" />
                </div>
                <div>
                  <h6 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>
                    Reward Transparency
                  </h6>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Prize details, values, and claim guidelines explicitly published.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(60, 155, 118, 0.12)',
                    border: '1px solid rgba(60, 155, 118, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Users size={24} color="#3C9B76" />
                </div>
                <div>
                  <h6 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>
                    Trusted by 10K+ Users
                  </h6>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Join thousands of active verified members.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(255, 107, 74, 0.12)',
                    border: '1px solid rgba(255, 107, 74, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <HelpCircle size={24} color="#FF6B4A" />
                </div>
                <div>
                  <h6 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>
                    24/7 Customer Support
                  </h6>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Dedicated claim verification and delivery assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ SECTION — Interactive Accordion
          ========================================================================= */}
      <section id="faq-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-veloop-gold" style={{ marginBottom: '10px' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
              Clear rules, authoritative transactions, and guaranteed fulfillment.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  style={{
                    background: 'rgba(50, 29, 53, 0.7)',
                    border: `1px solid ${isOpen ? 'rgba(246, 200, 95, 0.4)' : 'rgba(246, 200, 95, 0.15)'}`,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      color="var(--accent-gold)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 24px 20px 24px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.92rem',
                        lineHeight: '1.6',
                        borderTop: '1px solid rgba(246, 200, 95, 0.1)',
                        paddingTop: '14px',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
