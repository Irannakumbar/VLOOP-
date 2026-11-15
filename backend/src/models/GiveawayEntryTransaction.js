const mongoose = require('mongoose');

const giveawayEntryTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: ['VEs', 'SVEs', 'Tokens'],
    },
    type: {
      type: String,
      enum: ['debit', 'refund', 'credit'],
      default: 'debit',
    },
    previousBalance: {
      type: Number,
      required: true,
    },
    newBalance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'reverted'],
      default: 'completed',
    },
    idempotencyKey: {
      type: String,
      sparse: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GiveawayEntryTransaction', giveawayEntryTransactionSchema);

