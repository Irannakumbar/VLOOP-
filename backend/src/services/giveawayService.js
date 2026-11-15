const mongoose = require('mongoose');
const Giveaway = require('../models/Giveaway');
const GiveawayParticipation = require('../models/GiveawayParticipation');
const walletService = require('./walletService');
const fraudService = require('./fraudService');

class GiveawayService {
  /**
   * Authoritative Join Giveaway Transaction
   */
  async joinGiveaway({ userId, giveawayIdentifier, clientPayload = {}, req = null }) {
    // 1. Fetch Giveaway by ID or slug
    const isObjectId = mongoose.Types.ObjectId.isValid(giveawayIdentifier);
    const query = isObjectId ? { _id: giveawayIdentifier } : { slug: giveawayIdentifier };
    const giveaway = await Giveaway.findOne(query).populate('prize');

    if (!giveaway) {
      const err = new Error('Giveaway not found');
      err.statusCode = 404;
      throw err;
    }

    // 2. Verify Giveaway is Active
    if (giveaway.status !== 'active') {
      await fraudService.logFraudEvent({
        userId,
        eventType: 'inactive_giveaway_join',
        riskScore: 25,
        details: { giveawayId: giveaway._id, status: giveaway.status },
        req,
      });
      const err = new Error(`This giveaway is currently ${giveaway.status} and cannot be joined.`);
      err.statusCode = 400;
      throw err;
    }

    const now = new Date();
    if (giveaway.endDate && new Date(giveaway.endDate) <= now) {
      const err = new Error('This giveaway has already reached its deadline and is closed for new entries.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Prevent duplicate participation (Pre-check + DB compound index guarantee)
    const existingParticipation = await GiveawayParticipation.findOne({
      userId,
      giveawayId: giveaway._id,
    });

    if (existingParticipation) {
      await fraudService.logFraudEvent({
        userId,
        eventType: 'duplicate_entry_attempt',
        riskScore: 20,
        details: {
          giveawayId: giveaway._id,
          ticketNumber: existingParticipation.ticketNumber,
        },
        req,
      });
      const err = new Error('You have already joined this giveaway. Multiple entries are not permitted.');
      err.statusCode = 409;
      err.existingTicket = existingParticipation.ticketNumber;
      throw err;
    }

    // 4. Security Check: Detect if browser attempted to override entry fee or currency
    if (clientPayload.entryFee !== undefined && clientPayload.entryFee !== giveaway.entryFee) {
      await fraudService.logFraudEvent({
        userId,
        eventType: 'tampered_fee_payload',
        riskScore: 65,
        details: {
          expectedFee: giveaway.entryFee,
          sentFee: clientPayload.entryFee,
          giveawayId: giveaway._id,
        },
        req,
      });
      const err = new Error('Security Alert: Tampered transaction parameters detected.');
      err.statusCode = 400;
      throw err;
    }

    if (clientPayload.currency !== undefined && clientPayload.currency !== giveaway.currency) {
      await fraudService.logFraudEvent({
        userId,
        eventType: 'tampered_currency_payload',
        riskScore: 65,
        details: {
          expectedCurrency: giveaway.currency,
          sentCurrency: clientPayload.currency,
          giveawayId: giveaway._id,
        },
        req,
      });
      const err = new Error('Security Alert: Currency mismatch detected.');
      err.statusCode = 400;
      throw err;
    }

    // 5. Authoritatively check wallet balance
    const balanceCheck = await walletService.hasSufficientBalance(
      userId,
      giveaway.currency,
      giveaway.entryFee
    );

    if (!balanceCheck.hasBalance) {
      await fraudService.logFraudEvent({
        userId,
        eventType: 'insufficient_balance_bypass',
        riskScore: 10,
        details: {
          required: giveaway.entryFee,
          available: balanceCheck.currentBalance,
          currency: giveaway.currency,
        },
        req,
      });
      const err = new Error(
        `Insufficient ${giveaway.currency} balance. You need ${balanceCheck.deficit} more ${giveaway.currency} to participate.`
      );
      err.statusCode = 400;
      err.insufficientBalance = true;
      err.currentBalance = balanceCheck.currentBalance;
      err.requiredAmount = giveaway.entryFee;
      err.deficit = balanceCheck.deficit;
      err.currency = giveaway.currency;
      throw err;
    }

    // 6. Deduct balance from authoritative wallet ledger
    const deduction = await walletService.deductEntryFee({
      userId,
      giveawayId: giveaway._id,
      amount: giveaway.entryFee,
      currency: giveaway.currency,
      description: `Entry fee for ${giveaway.title}`,
    });

    // 7. Generate VIP Ticket Number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ticketNumber = `TK-VIP-${randomSuffix}`;

    // 8. Capture device signals
    const ipAddress =
      req?.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.socket?.remoteAddress ||
      '';
    const userAgent = req?.headers['user-agent'] || '';

    // 9. Create Participation Record
    const participation = new GiveawayParticipation({
      userId,
      giveawayId: giveaway._id,
      entryFeePaid: giveaway.entryFee,
      currencyUsed: giveaway.currency,
      ticketNumber,
      status: 'confirmed',
      ipAddress,
      userAgent,
    });

    await participation.save();

    // 10. Increment total participant counter on giveaway
    giveaway.totalParticipants += 1;
    await giveaway.save();

    return {
      participation,
      transaction: deduction,
      ticketNumber,
      giveaway: {
        id: giveaway._id,
        title: giveaway.title,
        slug: giveaway.slug,
        entryFee: giveaway.entryFee,
        currency: giveaway.currency,
        totalParticipants: giveaway.totalParticipants,
      },
      updatedBalance: deduction.newBalance,
    };
  }
}

module.exports = new GiveawayService();

