const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Prize = require('../models/Prize');
const Giveaway = require('../models/Giveaway');
const GiveawayParticipation = require('../models/GiveawayParticipation');
const GiveawayEntryTransaction = require('../models/GiveawayEntryTransaction');
const GiveawayWinner = require('../models/GiveawayWinner');
const PrizeClaim = require('../models/PrizeClaim');
const { seedPrizes, seedGiveaways } = require('./seedData');

const runSeed = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing giveaway collections...');

    await User.deleteMany({});
    await Prize.deleteMany({});
    await Giveaway.deleteMany({});
    await GiveawayParticipation.deleteMany({});
    await GiveawayEntryTransaction.deleteMany({});
    await GiveawayWinner.deleteMany({});
    await PrizeClaim.deleteMany({});

    console.log('[Seed] Seeding users...');
    // Create Admin User
    const admin = await User.create({
      name: 'VELOOP Admin',
      email: 'admin@veloop.com',
      password: 'Admin@123456',
      role: 'admin',
      walletBalances: {
        VEs: 15000,
        SVEs: 8000,
        Tokens: 50000,
      },
    });

    // Create Standard Demo User
    const demoUser = await User.create({
      name: 'Alex Vance',
      email: 'alex@veloop.com',
      password: 'User@123456',
      role: 'user',
      phone: '+91 98765 43210',
      walletBalances: {
        VEs: 1500, // Sufficient for any giveaway
        SVEs: 1000,
        Tokens: 5000,
      },
      shippingAddress: {
        fullName: 'Alex Vance',
        phone: '+91 98765 43210',
        address: 'Flat 402, Royale Residency, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
      },
    });

    // Create Low Balance User for testing insufficient balance flow
    const lowBalanceUser = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@veloop.com',
      password: 'User@123456',
      role: 'user',
      walletBalances: {
        VEs: 50, // Insufficient for 250 VEs
        SVEs: 100, // Insufficient for 500 SVEs
        Tokens: 200, // Insufficient for 2000 Tokens
      },
    });

    // Additional mock winner user accounts for realistic leaderboards
    const winnerUser1 = await User.create({
      name: 'Rohan Mehta',
      email: 'rohan.m@example.com',
      password: 'User@123456',
      role: 'user',
    });

    const winnerUser2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      password: 'User@123456',
      role: 'user',
    });

    console.log('[Seed] Seeding prizes...');
    const createdPrizes = await Prize.insertMany(seedPrizes);

    console.log('[Seed] Seeding active giveaways...');
    const giveawayDocs = seedGiveaways.map((gw, index) => ({
      ...gw,
      prize: createdPrizes[index]._id,
    }));
    await Giveaway.insertMany(giveawayDocs);

    console.log('[Seed] Seeding previous completed giveaways & winners for historical records...');
    // Completed Prize 1: iPad Air M2
    const ipadPrize = await Prize.create({
      name: 'iPad Air 11-inch M2 (WiFi 128GB)',
      type: 'physical',
      retailValue: 59900,
      currency: 'INR',
      image: '/assets/podium-gift-box.png',
      badge: 'Past Grand Prize',
      shortDescription: 'Freshly announced winner for iPad Air M2 giveaway.',
      stockQuantity: 1,
    });

    const pastGiveaway1 = await Giveaway.create({
      slug: 'ipad-air-m2',
      title: 'iPad Air 11-inch M2',
      subtitle: 'Apple M2 chip with Liquid Retina display',
      description: 'The incredible iPad Air M2 giveaway has successfully concluded.',
      prize: ipadPrize._id,
      entryFee: 350,
      currency: 'VEs',
      status: 'drawn',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      totalParticipants: 5410,
      winnerCount: 1,
      isFeatured: false,
    });

    // Participation for Rohan Mehta
    const part1 = await GiveawayParticipation.create({
      userId: winnerUser1._id,
      giveawayId: pastGiveaway1._id,
      entryFeePaid: 350,
      currencyUsed: 'VEs',
      ticketNumber: 'TK-VIP-91823',
      status: 'confirmed',
    });

    // Winner Record
    const winnerRecord1 = await GiveawayWinner.create({
      giveawayId: pastGiveaway1._id,
      userId: winnerUser1._id,
      prizeId: ipadPrize._id,
      participationId: part1._id,
      maskedUserId: winnerUser1.toMaskedId(),
      rank: 1,
      announcedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      claimStatus: 'claim_processing',
    });

    // Claim record for winner 1
    await PrizeClaim.create({
      winnerId: winnerRecord1._id,
      giveawayId: pastGiveaway1._id,
      userId: winnerUser1._id,
      prizeId: ipadPrize._id,
      claimType: 'physical',
      physicalDetails: {
        fullName: 'Rohan Mehta',
        phone: '+91 99887 76655',
        address: 'B-104, Palm Grove Heights, Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400053',
      },
      status: 'processing',
      trackingCode: 'BLUEDART-84920194',
      courierPartner: 'BlueDart Express',
      adminNotes: 'Address verified. Dispatched via express courier.',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 12 * 3600 * 1000),
    });

    // Completed Prize 2: ₹1,000 Amazon Voucher
    const amazon1000Prize = await Prize.create({
      name: '₹1,000 Amazon Gift Voucher',
      type: 'digital',
      retailValue: 1000,
      currency: 'INR',
      image: '/assets/prize-amazon-2000.png',
      badge: 'Completed Draw',
      shortDescription: '₹1,000 Amazon Gift Voucher completed drop.',
      stockQuantity: 1,
    });

    const pastGiveaway2 = await Giveaway.create({
      slug: 'amazon-1000-flash',
      title: '₹1,000 Amazon Gift Card Flash Drop',
      subtitle: 'Instant ₹1,000 digital code',
      description: 'Flash giveaway draw completed.',
      prize: amazon1000Prize._id,
      entryFee: 150,
      currency: 'VEs',
      status: 'drawn',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      totalParticipants: 3200,
      winnerCount: 1,
      isFeatured: false,
    });

    const part2 = await GiveawayParticipation.create({
      userId: winnerUser2._id,
      giveawayId: pastGiveaway2._id,
      entryFeePaid: 150,
      currencyUsed: 'VEs',
      ticketNumber: 'TK-VIP-44321',
      status: 'confirmed',
    });

    await GiveawayWinner.create({
      giveawayId: pastGiveaway2._id,
      userId: winnerUser2._id,
      prizeId: amazon1000Prize._id,
      participationId: part2._id,
      maskedUserId: winnerUser2.toMaskedId(),
      rank: 1,
      announcedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      claimStatus: 'claim_completed',
    });

    // Also give demo user Alex Vance one claimable winner prize in demo mode so the user can test the real claim flow!
    const testClaimPrize = await Prize.create({
      name: '₹500 Amazon Gift Voucher Winner Pass',
      type: 'digital',
      retailValue: 500,
      currency: 'INR',
      image: '/assets/prize-amazon-500.png',
      badge: 'Won by You!',
      shortDescription: 'Congratulations! You won this voucher. Complete your claim below.',
      stockQuantity: 1,
    });

    const testWonGiveaway = await Giveaway.create({
      slug: 'special-welcome-bonus-drop',
      title: 'Exclusive Welcome Bonus Voucher',
      subtitle: 'Special reward for active members',
      description: 'You were selected as the winner of this exclusive reward!',
      prize: testClaimPrize._id,
      entryFee: 100,
      currency: 'VEs',
      status: 'drawn',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      totalParticipants: 150,
      winnerCount: 1,
      isFeatured: false,
    });

    const testPart = await GiveawayParticipation.create({
      userId: demoUser._id,
      giveawayId: testWonGiveaway._id,
      entryFeePaid: 100,
      currencyUsed: 'VEs',
      ticketNumber: 'TK-VIP-WINNER-77',
      status: 'confirmed',
    });

    await GiveawayWinner.create({
      giveawayId: testWonGiveaway._id,
      userId: demoUser._id,
      prizeId: testClaimPrize._id,
      participationId: testPart._id,
      maskedUserId: demoUser.toMaskedId(),
      rank: 1,
      announcedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      claimStatus: 'claim_available', // Ready to claim right out of the box!
    });

    console.log('[Seed] Database successfully seeded with 6 active giveaways, past winners, and test users!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();

