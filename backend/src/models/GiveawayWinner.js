const mongoose = require('mongoose');

const giveawayWinnerSchema = new mongoose.Schema(
  {
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      required: true,
      index: true,
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
    participationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GiveawayParticipation',
      required: true,
    },
    maskedUserId: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      default: 1,
    },
    announcedAt: {
      type: Date,
      default: Date.now,
    },
    claimStatus: {
      type: String,
      enum: [
        'waiting_for_announcement',
        'claim_available',
        'claim_submitted',
        'claim_processing',
        'claim_completed',
        'claim_expired',
      ],
      default: 'claim_available',
      index: true,
    },
    claimDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    },
    drawnBy: {
      type: String,
      default: 'system_rng',
    },
    randomSeedHash: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

giveawayWinnerSchema.index({ giveawayId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GiveawayWinner', giveawayWinnerSchema);

