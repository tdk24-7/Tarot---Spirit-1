const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authJwt } = require('../middleware');
const { validate } = require('../middleware/validator');

// Tất cả các routes này đều yêu cầu xác thực admin
router.use(authJwt.verifyToken, authJwt.isAdmin);

// Lấy dashboard overview
router.get('/dashboard', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        users: 150,
        readings: 1240,
        forum_posts: 89,
        premium_users: 35
      },
      recent_activities: [
        { type: 'user_join', user_id: 1, username: 'user1', timestamp: new Date() },
        { type: 'reading', user_id: 2, username: 'user2', timestamp: new Date() }
      ]
    }
  });
});

// Get users list
router.get('/users', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: []
    }
  });
});

// Get user detail
router.get('/users/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: null
    }
  });
});

// Update user
router.put('/users/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully'
  });
});

// Get tarot cards management
router.get('/tarot/cards', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      cards: []
    }
  });
});

// Get forum posts management
router.get('/forum/posts', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      posts: []
    }
  });
});

// Get reports list
router.get('/reports', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      reports: []
    }
  });
});

// Get app settings
router.get('/settings', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      settings: {
        app_name: 'Tarot Spirit',
        maintenance_mode: false,
        allow_user_registration: true,
        default_theme: 'dark'
      }
    }
  });
});

// Update app settings
router.put('/settings', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Settings updated successfully'
  });
});

module.exports = router; 