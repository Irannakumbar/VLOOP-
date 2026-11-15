const mongoose = require('mongoose');

const fraudEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'duplicate_entry_attempt',
        'tampered_fee_payload',
        'tampered_currency_payload',
        'tampered_user_id',
        'insufficient_balance_bypass',
        'inactive_giveaway_join',
        'rapid_request_rate_exceeded',
        'unauthorized_admin_access',
      ],
      index: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 10,
    },
    details: {
      type: Object,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    mitigationAction: {
      type: String,
      enum: ['logged', 'blocked', 'flagged_for_review', 'rate_limited'],
      default: 'logged',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FraudEvent', fraudEventSchema);

