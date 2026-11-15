const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/shipping-address', authenticate, authController.updateShippingAddress);
router.post('/faucet', authenticate, authController.earnDailyTokens);

module.exports = router;
