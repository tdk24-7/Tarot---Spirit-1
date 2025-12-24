const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const journalController = require('../controllers/journal.controller');
const { authJwt } = require('../middleware');
const { validate } = require('../middleware/validator');

// Tất cả các routes này đều yêu cầu xác thực
router.use(authJwt.verifyToken);

// Lấy danh sách nhật ký với phân trang và filter
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
    query('sortBy').optional().isIn(['created_at', 'title', 'mood']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    validate
  ],
  journalController.getJournals
);

// Tạo nhật ký mới
router.post(
  '/',
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
    body('mood').optional().isIn(['happy', 'sad', 'neutral', 'anxious', 'calm', 'excited', 'confused']).withMessage('Invalid mood'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('associatedReadingId').optional().isInt().withMessage('Reading ID must be an integer'),
    validate
  ],
  journalController.createJournal
);

// Lấy chi tiết một nhật ký
router.get(
  '/:id',
  journalController.getJournalById
);

// Cập nhật nhật ký
router.put(
  '/:id',
  [
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('content').optional().trim().isLength({ min: 1 }).withMessage('Content is required'),
    body('mood').optional().isIn(['happy', 'sad', 'neutral', 'anxious', 'calm', 'excited', 'confused']).withMessage('Invalid mood'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validate
  ],
  journalController.updateJournal
);

// Xóa nhật ký
router.delete(
  '/:id',
  journalController.deleteJournal
);

module.exports = router; 