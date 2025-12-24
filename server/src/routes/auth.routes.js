const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const socialAuthController = require('../controllers/social.auth.controller');
const { validate } = require('../middleware/validator');
const { auth } = require('../middleware');

// User registration
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 100 }).withMessage('Username must be between 3 and 100 characters'),
    body('email').trim().isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
  ],
  authController.register
);

// User login
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.login
);

// Admin login
router.post(
  '/admin-login',
  [
    body('email').trim().isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  authController.adminLogin
);

// Social login (Google, Facebook)
router.post('/social-login', socialAuthController.socialLogin);

// Facebook login (legacy method)
router.post('/facebook/token', socialAuthController.facebookLogin);

// Google login
router.post('/social/google', socialAuthController.googleLogin);

// Google OAuth callback
router.get('/google/callback', socialAuthController.googleCallback);

// Forgot password
router.post(
  '/forgot-password',
  [
    body('email').trim().isEmail().withMessage('Must be a valid email address'),
    validate
  ],
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
  ],
  authController.resetPassword
);

// Get current user info
router.get('/me', auth.authenticate, authController.getCurrentUser);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

// Change password
router.post(
  '/change-password',
  auth.authenticate,
  [
    body('currentPassword').exists().withMessage('Yêu cầu mật khẩu hiện tại'),
    body('newPassword').isLength({ min: 8 }).withMessage('Mật khẩu mới phải có ít nhất 8 ký tự'),
    validate
  ],
  authController.changePassword
);

module.exports = router; 