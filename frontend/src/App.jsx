import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import GiveawayDetailPage from './pages/GiveawayDetailPage';
import WinnersPage from './pages/WinnersPage';
import MyClaimsPage from './pages/MyClaimsPage';
import AdminDashboard from './pages/AdminDashboard';
import RulesPage from './pages/RulesPage';

export function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Routed Content */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/giveaway/:slug" element={<GiveawayDetailPage />} />
          <Route path="/winners" element={<WinnersPage />} />
          <Route path="/claims" element={<MyClaimsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Auth Modal for Login / Registration */}
      <AuthModal />
    </div>
  );
}

export default App;
