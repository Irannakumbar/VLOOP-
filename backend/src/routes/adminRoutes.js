const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');

// All admin routes require authentication and admin role
router.use(authenticate, adminOnly);

router.get('/metrics', adminController.getDashboardStats);
router.get('/giveaways', adminController.listAllGiveaways);
router.post('/giveaways', adminController.createGiveaway);
router.put('/giveaways/:id', adminController.updateGiveaway);
router.post('/giveaways/:id/draw-winners', adminController.drawWinners);

router.get('/claims', adminController.listClaims);
router.put('/claims/:id', adminController.updateClaimStatus);

router.get('/participations', adminController.listParticipations);
router.get('/fraud-events', adminController.listFraudEvents);
router.get('/audit-logs', adminController.listAuditLogs);

module.exports = router;

