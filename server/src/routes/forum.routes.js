const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const forumController = require('../controllers/forum.controller');
const { authJwt } = require('../middleware');
const { validate } = require('../middleware/validator');

// Public routes - không cần đăng nhập

// Lấy danh sách bài viết
router.get(
  '/posts',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
    query('category').optional().isString(),
    query('sortBy').optional().isIn(['created_at', 'likes', 'views']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    validate
  ],
  forumController.getPosts
);

// Xem chi tiết bài viết
router.get(
  '/posts/:id',
  [
    param('id').isInt().withMessage('Post ID must be an integer'),
    validate
  ],
  forumController.getPostById
);

// Protected routes - cần đăng nhập

// Tạo bài viết mới
router.post(
  '/posts',
  [
    authJwt.verifyToken,
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('category').notEmpty().withMessage('Category is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validate
  ],
  forumController.createPost
);

// Cập nhật bài viết
router.put(
  '/posts/:id',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Post ID must be an integer'),
    body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('content').optional().trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('category').optional().notEmpty().withMessage('Category is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    validate
  ],
  forumController.updatePost
);

// Xóa bài viết
router.delete(
  '/posts/:id',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Post ID must be an integer'),
    validate
  ],
  forumController.deletePost
);

// Like/Unlike bài viết
router.post(
  '/posts/:id/like',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Post ID must be an integer'),
    validate
  ],
  forumController.toggleLikePost
);

// Thêm bình luận
router.post(
  '/posts/:id/comments',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Post ID must be an integer'),
    body('content').trim().isLength({ min: 1 }).withMessage('Comment content is required'),
    body('parentCommentId').optional().isInt().withMessage('Parent comment ID must be an integer'),
    validate
  ],
  forumController.addComment
);

// Cập nhật bình luận
router.put(
  '/comments/:id',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Comment ID must be an integer'),
    body('content').trim().isLength({ min: 1 }).withMessage('Comment content is required'),
    validate
  ],
  forumController.updateComment
);

// Xóa bình luận
router.delete(
  '/comments/:id',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Comment ID must be an integer'),
    validate
  ],
  forumController.deleteComment
);

// Like/Unlike bình luận
router.post(
  '/comments/:id/like',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Comment ID must be an integer'),
    validate
  ],
  forumController.toggleLikeComment
);

// Báo cáo bài viết
router.post(
  '/posts/:id/report',
  [
    authJwt.verifyToken,
    param('id').isInt().withMessage('Post ID must be an integer'),
    body('reason').notEmpty().withMessage('Report reason is required'),
    body('details').optional().isString(),
    validate
  ],
  forumController.reportPost
);

module.exports = router; 