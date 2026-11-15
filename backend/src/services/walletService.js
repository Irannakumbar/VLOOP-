const User = require('../models/User');
const GiveawayEntryTransaction = require('../models/GiveawayEntryTransaction');

/**
 * VELOOP Wallet Integration Service / Adapter
 *
 * NOTE FOR PRODUCTION:
 * This acts as the authoritative internal ledger and development adapter for the VELOOP currency system.
 * If connecting to the enterprise external VELOOP Core Banking/Wallet microservice, replace the User.walletBalances
 * atomic operations with the remote RPC/REST calls while preserving the local transaction log.
 */
class WalletService {
  /**
   * Get Authoritative Balance for a User in the specified currency
   */
  async getBalance(userId, currency) {
    const user = await User.findById(userId).select('walletBalances');
    if (!user) {
      throw new Error('User not found for wallet inquiry');
    }

    const currentBalance = user.walletBalances[currency] || 0;
    return {
      userId,
      currency,
      balance: currentBalance,
      isAuthoritative: true,
      adapter: 'VELOOP_INTERNAL_AUTHORITATIVE_LEDGER',
    };
  }

  /**
   * Authoritatively verify if user has enough balance
   */
  async hasSufficientBalance(userId, currency, requiredAmount) {
    const { balance } = await this.getBalance(userId, currency);
    return {
      hasBalance: balance >= requiredAmount,
      currentBalance: balance,
      requiredAmount,
      deficit: Math.max(0, requiredAmount - balance),
    };
  }

  /**
   * Atomically Deduct Entry Fee and write a transaction record
   */
  async deductEntryFee({
    userId,
    giveawayId,
    amount,
    currency,
    description,
    session = null,
  }) {
    // Fetch latest user document with lock/session
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found during transaction execution');
    }

    const currentBalance = user.walletBalances[currency] || 0;

    if (currentBalance < amount) {
      const err = new Error(
        `Insufficient ${currency} balance. Required: ${amount} ${currency}, Available: ${currentBalance} ${currency}.`
      );
      err.statusCode = 400;
      err.deficit = amount - currentBalance;
      err.currentBalance = currentBalance;
      throw err;
    }

    // Atomic deduction
    const previousBalance = currentBalance;
    const newBalance = previousBalance - amount;

    user.walletBalances[currency] = newBalance;
    await user.save({ session });

    // Generate unique transaction reference
    const transactionId = `TXN-VR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = new GiveawayEntryTransaction({
      transactionId,
      userId,
      giveawayId,
      amount,
      currency,
      type: 'debit',
      previousBalance,
      newBalance,
      status: 'completed',
      description: description || `Entry fee for giveaway ${giveawayId}`,
      metadata: {
        timestamp: new Date(),
        authoritativeAdapter: 'VELOOP_INTERNAL_AUTHORITATIVE_LEDGER',
      },
    });

    await transaction.save({ session });

    return {
      transactionId,
      previousBalance,
      newBalance,
      deductedAmount: amount,
      currency,
    };
  }

  /**
   * Revert / Refund in case of giveaway cancellation or administrative refund
   */
  async refundEntryFee({
    userId,
    giveawayId,
    amount,
    currency,
    reason,
    session = null,
  }) {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found for refund');

    const previousBalance = user.walletBalances[currency] || 0;
    const newBalance = previousBalance + amount;

    user.walletBalances[currency] = newBalance;
    await user.save({ session });

    const transactionId = `TXN-REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = new GiveawayEntryTransaction({
      transactionId,
      userId,
      giveawayId,
      amount,
      currency,
      type: 'refund',
      previousBalance,
      newBalance,
      status: 'completed',
      description: reason || `Refund for giveaway ${giveawayId}`,
    });

    await transaction.save({ session });
    return transaction;
  }
}

module.exports = new WalletService();
