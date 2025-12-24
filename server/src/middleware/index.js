/**
 * Middleware Index
 * Export tất cả các middleware từ một điểm
 */

const authMiddleware = require('./auth.middleware');

// Nếu file validator tồn tại
let validator;
try {
  validator = require('./validator');
} catch (error) {
  validator = null;
}

// Export trực tiếp từ file auth.middleware.js
const { authenticateJWT, isAdmin, restrictTo } = authMiddleware;

// Export cho file auth.js (legacy)
const auth = {
  authenticate: authenticateJWT,
  restrictTo
};

// Export cho file authJwt.js (legacy)
const authJwt = {
  verifyToken: authenticateJWT,
  isAdmin
};
 
module.exports = {
  // Middleware mới - nên sử dụng
  authMiddleware,
  authenticateJWT,
  isAdmin,
  restrictTo,
  
  // Legacy exports - chỉ để tương thích ngược
  auth,
  authJwt,
  
  // Nếu validator tồn tại
  ...(validator ? { validator } : {})
}; 