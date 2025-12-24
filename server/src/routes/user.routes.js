const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authJwt } = require('../middleware');
const { validate } = require('../middleware/validator');

// Tất cả các routes này đều yêu cầu xác thực
router.use(authJwt.verifyToken);

// Lấy thông tin hồ sơ người dùng
router.get('/profile', userController.getProfile);

// Cập nhật thông tin hồ sơ
router.put(
  '/profile',
  [
    body('fullName').optional().isString().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('bio').optional().isString().trim().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
    body('dateOfBirth').optional().isDate().withMessage('Invalid date format'),
    body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']).withMessage('Invalid gender'),
    validate
  ],
  userController.updateProfile
);

// Đổi mật khẩu
router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    validate
  ],
  userController.changePassword
);

// Lấy cài đặt người dùng
router.get('/settings', userController.getSettings);

// Cập nhật cài đặt người dùng
router.put(
  '/settings',
  [
    body('emailNotifications').optional().isBoolean(),
    body('pushNotifications').optional().isBoolean(),
    body('theme').optional().isIn(['light', 'dark', 'system']),
    body('language').optional().isIn(['en', 'vi', 'fr', 'es']),
    validate
  ],
  userController.updateSettings
);

// Tải lên avatar
router.post(
  '/avatar',
  userController.uploadAvatar
);

module.exports = router; 