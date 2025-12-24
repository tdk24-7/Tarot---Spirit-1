const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;

/**
 * Middleware xác thực JWT token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực'
      });
    }

    // Xác thực token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'tarot-system-secret-key'
      );

      // Kiểm tra user còn tồn tại không
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Người dùng không tồn tại'
        });
      }

      // Gán thông tin user vào request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Yêu cầu quyền admin'
    });
  }
};

/**
 * Middleware kiểm tra quyền linh hoạt
 * @param {String[]} roles - Danh sách các roles được phép truy cập
 * @returns {Function} Middleware function
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu xác thực trước'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Không đủ quyền truy cập'
      });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  isAdmin,
  restrictTo
}; 