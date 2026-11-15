const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { authenticate } = require('../middleware/auth');

router.get('/my-wins', authenticate, claimController.getMyWins);
router.post('/:id', authenticate, claimController.claimPrize);
router.get('/:id', authenticate, claimController.getMyClaim);

module.exports = router;
