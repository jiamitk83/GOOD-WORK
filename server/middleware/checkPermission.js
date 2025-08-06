const Permission = require('../models/Permission');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Admin has all permissions
      if (req.user.role.name === 'admin') {
        return next();
      }

      // Check if user's role has the required permission
      const hasPermission = req.user.role.permissions.some(
        permission => permission.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${requiredPermission}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

module.exports = checkPermission;
