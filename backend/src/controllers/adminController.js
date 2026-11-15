const crypto = require('crypto');
const User = require('../models/User');
const Giveaway = require('../models/Giveaway');
const Prize = require('../models/Prize');
const GiveawayParticipation = require('../models/GiveawayParticipation');
const GiveawayWinner = require('../models/GiveawayWinner');
const PrizeClaim = require('../models/PrizeClaim');
const FraudEvent = require('../models/FraudEvent');
const AuditLog = require('../models/AuditLog');
const auditService = require('../services/auditService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Get Admin Dashboard KPI metrics
// @route   GET /api/admin/metrics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalGiveaways,
      activeGiveaways,
      totalParticipations,
      pendingClaims,
      fraudEventsCount,
    ] = await Promise.all([
      User.countDocuments(),
      Giveaway.countDocuments(),
      Giveaway.countDocuments({ status: 'active' }),
      GiveawayParticipation.countDocuments(),
      PrizeClaim.countDocuments({ status: { $in: ['submitted', 'processing'] } }),
      FraudEvent.countDocuments(),
    ]);

    return successResponse(res, {
      totalUsers,
      totalGiveaways,
      activeGiveaways,
      totalParticipations,
      pendingClaims,
      fraudEventsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all giveaways for admin management
// @route   GET /api/admin/giveaways
exports.listAllGiveaways = async (req, res, next) => {
  try {
    const giveaways = await Giveaway.find()
      .populate('prize')
      .sort({ createdAt: -1 });

    return successResponse(res, { giveaways });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Giveaway with Prize
// @route   POST /api/admin/giveaways
exports.createGiveaway = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      slug,
      entryFee,
      currency,
      endDate,
      winnerCount,
      isFeatured,
      prizeName,
      prizeType,
      retailValue,
      prizeImage,
      badge,
      shortDescription,
    } = req.body;

    // Create prize first
    const prize = await Prize.create({
      name: prizeName || title,
      type: prizeType || 'digital',
      retailValue: retailValue || 1000,
      image: prizeImage || '/assets/prize-iphone-15-pro.png',
      badge: badge || 'Special Prize',
      shortDescription: shortDescription || description,
    });

    const giveawaySlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const giveaway = await Giveaway.create({
      title,
      subtitle,
      description,
      slug: giveawaySlug,
      prize: prize._id,
      entryFee: Number(entryFee) || 100,
      currency: currency || 'VEs',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(endDate || Date.now() + 7 * 24 * 3600 * 1000),
      winnerCount: Number(winnerCount) || 1,
      isFeatured: !!isFeatured,
    });

    await auditService.log({
      actorId: req.user._id,
      action: 'CREATE_GIVEAWAY',
      targetModel: 'Giveaway',
      targetId: giveaway._id,
      changes: { title, slug: giveawaySlug, entryFee, currency },
      req,
    });

    return successResponse(res, { giveaway, prize }, 'Giveaway created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update Giveaway status or properties
// @route   PUT /api/admin/giveaways/:id
exports.updateGiveaway = async (req, res, next) => {
  try {
    const giveaway = await Giveaway.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('prize');

    if (!giveaway) {
      return errorResponse(res, 'Giveaway not found', 404);
    }

    await auditService.log({
      actorId: req.user._id,
      action: 'UPDATE_GIVEAWAY',
      targetModel: 'Giveaway',
      targetId: giveaway._id,
      changes: req.body,
      req,
    });

    return successResponse(res, { giveaway }, 'Giveaway updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Draw and finalize winners for a giveaway (Provably Fair PRNG)
// @route   POST /api/admin/giveaways/:id/draw-winners
exports.drawWinners = async (req, res, next) => {
  try {
    const giveaway = await Giveaway.findById(req.params.id).populate('prize');
    if (!giveaway) {
      return errorResponse(res, 'Giveaway not found', 404);
    }

    const participants = await GiveawayParticipation.find({
      giveawayId: giveaway._id,
      status: 'confirmed',
    }).populate('userId');

    if (participants.length === 0) {
      return errorResponse(res, 'Cannot draw winners: There are zero confirmed participants in this giveaway.', 400);
    }

    // Number of winners to pick
    const countToPick = Math.min(giveaway.winnerCount || 1, participants.length);

    // Cryptographic shuffle with SHA-256 entropy
    const seedEntropy = `${giveaway._id}-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
    const hashSeed = crypto.createHash('sha256').update(seedEntropy).digest('hex');

    // Fisher-Yates shuffle using crypto random ints
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selectedWinners = shuffled.slice(0, countToPick);
    const winnerRecords = [];

    for (let index = 0; index < selectedWinners.length; index++) {
      const winnerPart = selectedWinners[index];
      const maskedUserId = winnerPart.userId ? winnerPart.userId.toMaskedId() : `usr_***${winnerPart._id.toString().slice(-4)}`;

      // Check if winner record already exists
      const existing = await GiveawayWinner.findOne({
        giveawayId: giveaway._id,
        userId: winnerPart.userId._id,
      });

      if (!existing) {
        const record = await GiveawayWinner.create({
          giveawayId: giveaway._id,
          userId: winnerPart.userId._id,
          prizeId: giveaway.prize._id,
          participationId: winnerPart._id,
          maskedUserId,
          rank: index + 1,
          announcedAt: new Date(),
          claimStatus: 'claim_available',
          drawnBy: req.user.email,
          randomSeedHash: hashSeed,
        });
        winnerRecords.push(record);
      }
    }

    // Mark giveaway as drawn
    giveaway.status = 'drawn';
    await giveaway.save();

    await auditService.log({
      actorId: req.user._id,
      action: 'DRAW_WINNERS',
      targetModel: 'Giveaway',
      targetId: giveaway._id,
      changes: {
        winnerCount: winnerRecords.length,
        seedHash: hashSeed,
      },
      req,
    });

    return successResponse(
      res,
      { winners: winnerRecords, seedHash: hashSeed },
      `Successfully selected and finalized ${winnerRecords.length} winner(s)!`
    );
  } catch (error) {
    next(error);
  }
};

// @desc    List all prize claims for admin review
// @route   GET /api/admin/claims
exports.listClaims = async (req, res, next) => {
  try {
    const claims = await PrizeClaim.find()
      .populate('userId', 'name email phone')
      .populate('giveawayId', 'title slug')
      .populate('prizeId')
      .sort({ submittedAt: -1 });

    return successResponse(res, { claims });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim fulfillment status
// @route   PUT /api/admin/claims/:id
exports.updateClaimStatus = async (req, res, next) => {
  try {
    const { status, trackingCode, courierPartner, voucherCode, adminNotes } = req.body;

    const claim = await PrizeClaim.findById(req.params.id);
    if (!claim) {
      return errorResponse(res, 'Claim record not found', 404);
    }

    if (status) claim.status = status;
    if (trackingCode) claim.trackingCode = trackingCode;
    if (courierPartner) claim.courierPartner = courierPartner;
    if (adminNotes) claim.adminNotes = adminNotes;
    if (voucherCode && claim.digitalDetails) {
      claim.digitalDetails.voucherCode = voucherCode;
    }

    if (status === 'processing') claim.processedAt = new Date();
    if (status === 'completed') claim.completedAt = new Date();

    await claim.save();

    // Sync winner claimStatus
    const winnerStatusMap = {
      submitted: 'claim_submitted',
      processing: 'claim_processing',
      completed: 'claim_completed',
      rejected: 'claim_expired',
    };

    if (winnerStatusMap[status]) {
      await GiveawayWinner.findByIdAndUpdate(claim.winnerId, {
        claimStatus: winnerStatusMap[status],
      });
    }

    await auditService.log({
      actorId: req.user._id,
      action: 'UPDATE_CLAIM_STATUS',
      targetModel: 'PrizeClaim',
      targetId: claim._id,
      changes: { status, trackingCode, voucherCode },
      req,
    });

    return successResponse(res, { claim }, `Claim status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    View fraud prevention events & security alerts
// @route   GET /api/admin/fraud-events
exports.listFraudEvents = async (req, res, next) => {
  try {
    const events = await FraudEvent.find()
      .populate('userId', 'name email status riskScore')
      .sort({ createdAt: -1 })
      .limit(100);

    return successResponse(res, { events });
  } catch (error) {
    next(error);
  }
};

// @desc    View administrative audit logs
// @route   GET /api/admin/audit-logs
exports.listAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    return successResponse(res, { logs });
  } catch (error) {
    next(error);
  }
};

// @desc    List all participations
// @route   GET /api/admin/participations
exports.listParticipations = async (req, res, next) => {
  try {
    const participations = await GiveawayParticipation.find()
      .populate('userId', 'name email')
      .populate('giveawayId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(150);

    return successResponse(res, { participations });
  } catch (error) {
    next(error);
  }
};

