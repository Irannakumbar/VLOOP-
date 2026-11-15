const mongoose = require('mongoose');

const prizeClaimSchema = new mongoose.Schema(
  {
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GiveawayWinner',
      required: true,
      unique: true, // One claim per winner record
    },
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    prizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prize',
      required: true,
    },
    claimType: {
      type: String,
      enum: ['physical', 'digital'],
      required: true,
    },
    // Physical prize details
    physicalDetails: {
      fullName: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pinCode: { type: String, trim: true },
    },
    // Digital prize details
    digitalDetails: {
      email: { type: String, trim: true, lowercase: true },
      voucherCode: { type: String, default: '' }, // Revealed to winner upon completion
    },
    status: {
      type: String,
      enum: ['submitted', 'processing', 'completed', 'rejected'],
      default: 'submitted',
      index: true,
    },
    trackingCode: {
      type: String,
      default: '',
    },
    courierPartner: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PrizeClaim', prizeClaimSchema);
