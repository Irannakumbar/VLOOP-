const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Giveaway title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    prize: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prize',
      required: true,
    },
    entryFee: {
      type: Number,
      required: [true, 'Entry fee is required'],
      min: [0, 'Entry fee cannot be negative'],
    },
    currency: {
      type: String,
      enum: ['VEs', 'SVEs', 'Tokens'],
      required: [true, 'Currency is required'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'ended', 'drawn', 'cancelled'],
      default: 'active',
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },
    winnerCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    eligibilityCriteria: {
      type: String,
      default: 'All verified VELOOP Rewards account holders with sufficient balance.',
    },
    rules: {
      type: [String],
      default: [
        'Single entry per verified user account.',
        'Entry fee is deducted authoritatively from user wallet upon confirmation.',
        'Winners are selected via cryptographically secure random distribution.',
        'Prize claim must be completed within 14 calendar days of winner announcement.',
        'Prizes cannot be transferred or exchanged for direct cash equivalents unless explicitly approved.',
      ],
    },
    termsAndConditions: {
      type: [String],
      default: [
        'Participation constitutes full agreement to the official VELOOP Giveaway Rules.',
        'VELOOP reserves the right to verify participant identity and disqualify any fraudulent entries.',
        'Void where prohibited by applicable jurisdiction laws.',
        'Physical prize shipments are limited to serviceable residential pin codes.',
      ],
    },
    winnerSelectionProcess: {
      type: String,
      default:
        'Winners are drawn automatically using a provably fair pseudo-random algorithm verified against SHA-256 entropy hashes at the giveaway end time.',
    },
    claimProcess: {
      type: String,
      default:
        'Winning accounts receive an instant winner notification badge. Physical prizes require postal delivery verification; digital vouchers are dispatched directly to the account email address.',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

giveawaySchema.index({ status: 1, endDate: 1 });

module.exports = mongoose.model('Giveaway', giveawaySchema);
