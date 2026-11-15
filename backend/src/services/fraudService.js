const FraudEvent = require('../models/FraudEvent');
const User = require('../models/User');

class FraudService {
  /**
   * Log a security or fraud event with risk calculation
   */
  async logFraudEvent({
    userId = null,
    eventType,
    riskScore = 15,
    details = {},
    req = null,
    mitigationAction = 'logged',
  }) {
    const ipAddress =
      req?.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.socket?.remoteAddress ||
      'unknown';
    const userAgent = req?.headers['user-agent'] || 'unknown';

    const event = await FraudEvent.create({
      userId,
      eventType,
      riskScore,
      details,
      ipAddress,
      userAgent,
      mitigationAction,
    });

    // If severe event, increment user risk score
    if (userId && riskScore >= 50) {
      await User.findByIdAndUpdate(userId, {
        $inc: { riskScore },
        $set: { status: riskScore >= 80 ? 'flagged' : 'active' },
      });
    }

    return event;
  }
}

module.exports = new FraudService();
