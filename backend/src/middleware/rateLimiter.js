const rateLimit = require('express-rate-limit');

// General API Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests received from this connection. Please try again later.',
  },
});

// Strict limiter for authentication
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 attempts per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please pause and try again in a few minutes.',
  },
});

// Participation limiter to prevent rapid submission bots
const participationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 12, // 12 participation attempts per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You are submitting giveaway entries too rapidly. Please slow down.',
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  participationLimiter,
};
