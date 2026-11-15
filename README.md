# VELOOP REWARDS — GIVEAWAY FULL-STACK PLATFORM

A production-grade, transaction-safe, full-stack rewards and giveaway application engineered with **React.js, Vite, Node.js, Express.js, and MongoDB**.

Designed with a luxury fintech-grade visual aesthetic utilizing a strict zero-blue design system: **Deep Aubergine (`#211326`)**, **Rich Plum (`#321D35`)**, **Vibrant Coral (`#FF6B4A`)**, and **Warm Champagne Gold (`#F6C85F`)**.

---

## 🚀 Key Features

- **Authoritative Rewards & Wallet Ledger**:
  - Eliminates client-side trust: balances, entry fees, and currencies are strictly validated and atomically deducted on the backend server.
  - Multi-currency platform support: **VEs** (Veloop Entries), **SVEs** (Special VEs), and daily **Tokens**.
- **Provably Fair Winner Selection**:
  - Cryptographically secure pseudo-random draw algorithm using SHA-256 entropy seeds.
  - Publicly visible masked user IDs (`usr_***8942`) and draw verification hashes.
- **Fraud Prevention & Security**:
  - Compound unique MongoDB indexes on `(userId, giveawayId)` preventing duplicate participation.
  - Real-time detection for payload tampering (tampered fee, currency, or user ID).
  - Rate limiting on sensitive authentication and participation endpoints.
  - Centralized error handling and security headers via Helmet and CORS.
- **Prize Claim & Dispatch Fulfillment**:
  - Physical prize claim form with postal delivery address and courier tracking numbers.
  - Digital gift-card claim flow with encrypted voucher delivery to registered email addresses.
  - Full winner states: `waiting_for_announcement`, `claim_available`, `claim_submitted`, `claim_processing`, `claim_completed`.
- **Administrative Control Suite**:
  - Real-time dashboard KPI metrics (registered users, entries logged, fraud alerts).
  - Giveaway management: live status toggles, participant inspection, and instant provably fair draw execution.
  - Prize claim queue with dispatch tracking assignment.
  - Security event inspection and administrative audit trail.

---

## 🎨 Design System & Strict Zero-Blue Palette

| Element | Color Name | Hex Code | Purpose |
|---|---|---|---|
| Primary Background | Deep Aubergine | `#211326` | Main page canvas & dark surface |
| Secondary Background | Rich Plum | `#321D35` | Card backgrounds & elevated containers |
| Primary Accent | Vibrant Coral | `#FF6B4A` | Action buttons, highlight badges, primary CTAs |
| Secondary Accent | Warm Champagne Gold | `#F6C85F` | VIP tickets, countdown timers, brand headings |
| Supporting Accent | Emerald Green | `#3C9B76` | Success confirmations & verified trust badges |
| Light Surface | Warm Ivory | `#FFF7EA` | High-contrast text & modal highlights |
| Dark Text | Plum Charcoal | `#241B27` | High-contrast text on light surfaces |
| Muted Text | Plum Grey | `#8B7D89` | Subtitles, labels, and timestamps |

---

## 📁 Project Architecture

```
VLOOP/
├── assets/                          # Original supplied prize and banner assets
├── Reference/                       # Reference design screenshots (Ref_01 & Ref_02)
├── backend/                         # Express.js & MongoDB Server
│   ├── src/
│   │   ├── config/                  # Database & environment configurations
│   │   ├── controllers/             # Auth, Giveaway, Claim, Admin, Wallet
│   │   ├── middleware/              # JWT Auth, Admin Role, Rate Limiter, Error Handler
│   │   ├── models/                  # 9 Mongoose schemas with compound unique indexes
│   │   ├── routes/                  # API routes (/api/auth, /api/giveaways, /api/claims, /api/admin)
│   │   ├── services/                # Atomic transactions, fraud monitoring, audit logs
│   │   ├── seed/                    # Seed data with exact 6 prizes & historical winners
│   │   ├── utils/                   # Masking helpers & response formatters
│   │   ├── app.js                   # Express application setup
│   │   └── server.js                # Server entry point
│   ├── tests/
│   │   └── test_suite.js            # Automated security & business logic test suite
│   ├── .env.example
│   └── package.json
└── frontend/                        # React 18 + Vite Frontend
    ├── public/
    │   └── assets/                  # Mapped project assets (iPhone, Watch, AirPods, Amazon cards)
    ├── src/
    │   ├── components/              # Navbar, Footer, GiveawayCard, Countdown, Modals, Loader
    │   ├── context/                 # AuthContext & NotificationContext
    │   ├── pages/                   # Home, Detail, Winners, My Claims, Admin, Rules
    │   ├── services/                # Axios API client
    │   ├── styles/                  # Zero-blue CSS variables and design tokens
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🛠️ Required Entry Fees & Giveaways

| Giveaway | Prize Type | Entry Fee & Currency | Retail Value | Asset Filename |
|---|---|---|---|---|
| **iPhone 15 Pro 128GB** | Physical | **250 VEs** | ₹1,34,900 | `prize-iphone-15-pro.png` |
| **Apple Watch Series 9** | Physical | **200 VEs** | ₹41,900 | `prize-apple-watch.png` |
| **AirPods Pro 2** | Physical | **500 SVEs** | ₹24,900 | `prize-airpods.png` |
| **Amazon Gift Card ₹2,000** | Digital | **500 VEs** | ₹2,000 | `prize-amazon-2000.png` |
| **Amazon Gift Card ₹500** | Digital | **300 VEs** | ₹500 | `prize-amazon-500.png` |
| **₹20 Voucher Daily Drop** | Digital | **2,000 Tokens** | ₹20 | `prize-amazon-20.png` |

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v24+ recommended)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI (running on port 27017 by default)

### 1. Backend Setup

```bash
cd backend
npm install

# Configure environment variables (create .env from .env.example)
cp .env.example .env

# Seed database with the 6 active giveaways and demo accounts
npm run seed

# Start backend server
npm start
# Server listens on http://localhost:5000 (API at /api)
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Vite development server
npm run dev
# Application available at http://localhost:5173
```

---

## 🔑 Test Accounts (One-Click Logins Available in Modal)

| Role | Email | Password | Starting Balances | Purpose |
|---|---|---|---|---|
| **Standard User** | `alex@veloop.com` | `User@123456` | 1,500 VEs • 1,000 SVEs • 5,000 Tokens | Full participation & claim testing |
| **Low-Balance User**| `sarah@veloop.com`| `User@123456` | 50 VEs • 100 SVEs • 200 Tokens | Insufficient balance & deficit testing |
| **Administrator** | `admin@veloop.com` | `Admin@123456` | 15,000 VEs • 8,000 SVEs • 50,000 Tokens | Admin suite, draw engine, claims & fraud |

---

## 🧪 Automated Testing

Run the full end-to-end security and transaction test suite:

```bash
node backend/tests/test_suite.js
```

### Verifies:
1. Live statistics aggregation from active database collections.
2. Unauthenticated participation blocking (401).
3. JWT token generation and role authorization.
4. Non-admin access prevention to admin metrics (403).
5. Atomic balance deduction and VIP ticket issuance.
6. Duplicate participation prevention via MongoDB compound unique index (409).
7. Insufficient balance rejection and deficit calculation.
8. Client-side tampered fee payload detection.
9. Client-side tampered currency detection.
10. Non-winner claim rejection.
11. Admin provably fair winner drawing.
12. Fraud event logging and risk scoring.

---

## 📡 REST API Reference

### Public & User Routes

- `GET /api/giveaways/statistics` — Platform live participant, active draw, and prize counts.
- `GET /api/giveaways` or `GET /api/giveaways/current` — List all active giveaways.
- `GET /api/giveaways/:id` — Get single giveaway details with authenticated user status.
- `GET /api/giveaways/:id/my-status` — Check participation status and ticket for a giveaway.
- `POST /api/giveaways/:id/join` — Atomically participate in giveaway and deduct balance.
- `GET /api/giveaways/previous/winners` — List all historical announced winners.
- `POST /api/giveaways/:id/claim` — Submit postal address or email claim for won prize.
- `GET /api/claims/my-wins` — List all won prizes and courier tracking records for current user.

### Authentication Routes

- `POST /api/auth/register` — Register account with welcome bonus.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Get current user profile and live authoritative wallet balances.
- `POST /api/auth/faucet` — Claim daily activity tokens.

### Protected Admin Routes (`role: admin`)

- `GET /api/admin/metrics` — Dashboard KPI analytics.
- `GET /api/admin/giveaways` — Complete giveaway catalog management.
- `POST /api/admin/giveaways` — Create new giveaway and configure prize specifications.
- `POST /api/admin/giveaways/:id/draw-winners` — Execute cryptographic random winner draw.
- `GET /api/admin/claims` — Review and update prize dispatch fulfillment.
- `GET /api/admin/fraud-events` — Real-time security alerts and risk event monitor.
- `GET /api/admin/audit-logs` — Immutable administrative action logs.

