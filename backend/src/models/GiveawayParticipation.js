const mongoose = require('mongoose');

const giveawayParticipationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      required: true,
      index: true,
    },
    entryFeePaid: {
      type: Number,
      required: true,
      min: 0,
    },
    currencyUsed: {
      type: String,
      required: true,
      enum: ['VEs', 'SVEs', 'Tokens'],
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'refunded'],
      default: 'confirmed',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    deviceFingerprint: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index strictly preventing duplicate participation
giveawayParticipationSchema.index({ userId: 1, giveawayId: 1 }, { unique: true });

module.exports = mongoose.model('GiveawayParticipation', giveawayParticipationSchema);

