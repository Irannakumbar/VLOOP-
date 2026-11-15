const { errorResponse } = require('../utils/responseFormatter');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'Access denied: You do not possess the required administrative permissions for this action.',
        403
      );
    }

    next();
  };
};

module.exports = {
  adminOnly: requireRole('admin'),
  requireRole,
};
