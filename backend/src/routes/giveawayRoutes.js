const express = require('express');
const router = express.Router();
const giveawayController = require('../controllers/giveawayController');
const claimController = require('../controllers/claimController');
const { authenticate, optionalAuthenticate } = require('../middleware/auth');
const { participationLimiter } = require('../middleware/rateLimiter');

// Static collection routes (must precede :id dynamic parameter)
router.get('/', giveawayController.getCurrentGiveaways);
router.get('/current', giveawayController.getCurrentGiveaways);
router.get('/previous', giveawayController.getPreviousGiveaways);
router.get('/previous/winners', giveawayController.getPreviousWinners);
router.get('/statistics', giveawayController.getStatistics);

// Dynamic routes
router.get('/:id', optionalAuthenticate, giveawayController.getGiveawayById);
router.get('/:id/my-status', authenticate, giveawayController.getMyStatus);
router.post('/:id/join', authenticate, participationLimiter, giveawayController.joinGiveaway);
router.get('/:id/winners', giveawayController.getGiveawayWinners);

// Claim routes for a giveaway
router.post('/:id/claim', authenticate, claimController.claimPrize);
router.get('/:id/my-claim', authenticate, claimController.getMyClaim);

module.exports = router;

