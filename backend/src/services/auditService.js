const AuditLog = require('../models/AuditLog');

class AuditService {
  /**
   * Record administrative mutations and high-value system operations
   */
  async log({
    actorId,
    action,
    targetModel,
    targetId,
    changes = {},
    req = null,
  }) {
    const ipAddress =
      req?.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.socket?.remoteAddress ||
      'internal_system';
    const userAgent = req?.headers['user-agent'] || 'internal_system';

    const logEntry = await AuditLog.create({
      actorId,
      action,
      targetModel,
      targetId: targetId ? targetId.toString() : 'N/A',
      changes,
      ipAddress,
      userAgent,
    });

    return logEntry;
  }
}

module.exports = new AuditService();
