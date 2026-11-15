const mongoose = require('mongoose');
const GiveawayWinner = require('../models/GiveawayWinner');
const PrizeClaim = require('../models/PrizeClaim');
const Giveaway = require('../models/Giveaway');
const Prize = require('../models/Prize');
const auditService = require('../services/auditService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Submit a prize claim (Physical address or digital email)
// @route   POST /api/giveaways/:id/claim
exports.claimPrize = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const giveaway = await Giveaway.findOne(query);
    if (!giveaway) {
      return errorResponse(res, 'Giveaway not found', 404);
    }

    // Verify user is a confirmed winner of this giveaway
    const winnerRecord = await GiveawayWinner.findOne({
      giveawayId: giveaway._id,
      userId: req.user._id,
    }).populate('prize');

    if (!winnerRecord) {
      return errorResponse(
        res,
        'Claim Rejected: You are not recorded as a verified winner for this giveaway.',
        403
      );
    }

    if (winnerRecord.claimStatus === 'claim_completed') {
      return errorResponse(res, 'This prize claim has already been completed and delivered.', 400);
    }

    if (winnerRecord.claimStatus === 'claim_submitted' || winnerRecord.claimStatus === 'claim_processing') {
      return errorResponse(
        res,
        'Your claim has already been submitted and is currently being processed by our rewards dispatch team.',
        400
      );
    }

    const { claimType, physicalDetails, digitalDetails } = req.body;
    const prize = winnerRecord.prize;

    let claimData = {
      winnerId: winnerRecord._id,
      giveawayId: giveaway._id,
      userId: req.user._id,
      prizeId: prize._id,
      claimType: claimType || prize.type,
      status: 'submitted',
      submittedAt: new Date(),
    };

    if (claimData.claimType === 'physical') {
      if (!physicalDetails || !physicalDetails.fullName || !physicalDetails.address || !physicalDetails.city || !physicalDetails.pinCode) {
        return errorResponse(
          res,
          'Please provide all required physical shipping details: Full Name, Address, City, State, and PIN Code.',
          400
        );
      }
      claimData.physicalDetails = physicalDetails;
    } else {
      if (!digitalDetails || !digitalDetails.email) {
        return errorResponse(res, 'Please provide a valid delivery email address for your digital voucher.', 400);
      }
      claimData.digitalDetails = digitalDetails;
    }

    // Upsert or create claim
    const claim = await PrizeClaim.findOneAndUpdate(
      { winnerId: winnerRecord._id },
      claimData,
      { new: true, upsert: true }
    );

    // Update winner status to claim_submitted
    winnerRecord.claimStatus = 'claim_submitted';
    await winnerRecord.save();

    await auditService.log({
      actorId: req.user._id,
      action: 'SUBMIT_PRIZE_CLAIM',
      targetModel: 'PrizeClaim',
      targetId: claim._id,
      changes: { claimType: claimData.claimType, status: 'submitted' },
      req,
    });

    return successResponse(
      res,
      { claim, winnerStatus: winnerRecord.claimStatus },
      'Your prize claim has been submitted successfully! Our dispatch team will verify and process delivery shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's claim status for a giveaway
// @route   GET /api/giveaways/:id/my-claim
exports.getMyClaim = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const query = isObjectId ? { _id: identifier } : { slug: identifier };

    const giveaway = await Giveaway.findOne(query);
    if (!giveaway) {
      return errorResponse(res, 'Giveaway not found', 404);
    }

    const claim = await PrizeClaim.findOne({
      giveawayId: giveaway._id,
      userId: req.user._id,
    }).populate('prizeId');

    const winner = await GiveawayWinner.findOne({
      giveawayId: giveaway._id,
      userId: req.user._id,
    });

    return successResponse(res, {
      hasWon: !!winner,
      winnerStatus: winner ? winner.claimStatus : null,
      claim: claim || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all prizes won by current authenticated user
// @route   GET /api/claims/my-wins
exports.getMyWins = async (req, res, next) => {
  try {
    const wins = await GiveawayWinner.find({ userId: req.user._id })
      .populate('prizeId')
      .populate('giveawayId')
      .sort({ announcedAt: -1 });

    const claims = await PrizeClaim.find({ userId: req.user._id });
    const claimMap = {};
    claims.forEach((c) => {
      claimMap[c.winnerId.toString()] = c;
    });

    const populatedWins = wins.map((w) => ({
      ...w.toObject(),
      claim: claimMap[w._id.toString()] || null,
    }));

    return successResponse(res, { wins: populatedWins });
  } catch (error) {
    next(error);
  }
};
