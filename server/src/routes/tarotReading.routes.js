const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tarotReadingController = require('../controllers/tarotReading.controller');
const middleware = require('../middleware');
const { authenticate, restrictTo } = middleware.auth;
const { validate } = middleware.validator;
const { authJwt } = middleware;
const tarotController = require('../controllers/tarot.controller');

// Get recent readings (public - limited data)
router.get('/recent', tarotReadingController.getRecentReadings);

// TẠM THỜI BỎ QÁC ROUTE PHÍA DƯỚI ĐÂY - PHÁT TRIỂN CHỈ
router.use(authenticate);

// Get user's readings
router.get('/my-readings', tarotReadingController.getUserReadings);

// Create a new standard reading
router.post(
  '/',
  [
    body('topic_id').isInt().withMessage('Topic ID must be an integer'),
    body('spread_id').isInt().withMessage('Spread ID must be an integer'),
    body('question').optional().isString().withMessage('Question must be a string'),
    body('selected_cards').isArray().withMessage('Selected cards must be an array'),
    body('type').isString().withMessage('Type must be a string'),
    validate
  ],
  tarotController.createReading
);

// Create a new AI reading
router.post(
  '/ai',
  [
    // Cho phép cả hai format API mới và cũ
    body(['topic_id', 'topicId']).optional().isInt().withMessage('Topic ID must be an integer'),
    body(['spread_id', 'spreadId']).optional().isInt().withMessage('Spread ID must be an integer'),
    body('question').optional().isString().withMessage('Question must be a string'),
    
    // Cho phép cả hai loại format của cards
    body(['selected_cards', 'selectedCards']).optional().isArray().withMessage('Selected cards must be an array'),
    body('selectedIndices').optional().isArray().withMessage('Selected indices must be an array'),
    body('displayedCards').optional().isArray().withMessage('Displayed cards must be an array'),
    
    // Custom validation để đảm bảo ít nhất một trong các format cards được cung cấp
    (req, res, next) => {
      // Kiểm tra xem có ít nhất một trong các format cards không
      if (
        (req.body.selected_cards && Array.isArray(req.body.selected_cards)) ||
        (req.body.selectedCards && Array.isArray(req.body.selectedCards)) ||
        (req.body.selectedIndices && Array.isArray(req.body.selectedIndices) && req.body.displayedCards && Array.isArray(req.body.displayedCards))
      ) {
        return next(); // Tiếp tục nếu có ít nhất một format
      }
      
      return res.status(400).json({
        status: 'error',
        message: 'At least one card selection format is required (selected_cards, selectedCards, or selectedIndices+displayedCards)'
      });
    }
  ],
  tarotController.createAIReading
);

// Get a specific reading by ID
router.get('/:id', tarotReadingController.getReadingById);

// Generate AI interpretation for a reading
router.post(
  '/:id/interpretations',
  [authJwt.verifyToken],
  tarotReadingController.generateInterpretation
);

// Get all interpretations for a reading
router.get(
  '/:id/interpretations',
  [authJwt.verifyToken],
  tarotReadingController.getReadingInterpretations
);

// Routes for admin users
router.use(restrictTo('admin'));

// Get all readings (admin only)
router.get('/', tarotReadingController.getAllReadings);

// Update a reading (admin only)
router.put('/:id', tarotReadingController.updateReading);

// Delete a reading (admin only)
router.delete('/:id', tarotReadingController.deleteReading);

// Get readings for a user
router.get(
  '/user/:userId',
  [authJwt.verifyToken],
  tarotReadingController.getUserReadings
);

// Public routes - không cần đăng nhập

// Lấy danh sách lá bài Tarot
router.get('/cards', tarotController.getAllCards);

// Xem chi tiết một lá bài
router.get('/cards/:id', tarotController.getCardById);

// Lấy bài Tarot hàng ngày
router.get('/daily', tarotController.getDailyCard);

// Lấy ngẫu nhiên các lá bài
router.post('/random', tarotController.getRandomCards);

// Protected routes - cần đăng nhập

// Tạo kết quả bói bài mới (bói thường)
router.post(
  '/readings/standard',
  [
    // Bỏ authJwt.verifyToken,
    body('selectedIndices').isArray().withMessage('Selected indices must be an array'),
    body('displayedCards').isArray().withMessage('Displayed cards must be an array'),
    body('domain').optional(),
    body('question').optional(),
    validate
  ],
  tarotController.createReading
);

// Lấy danh sách lịch sử bói bài
router.get(
  '/readings',
  // Bỏ authJwt.verifyToken,
  tarotController.getUserReadings
);

// Xem chi tiết một lần bói
router.get(
  '/readings/:id',
  // Bỏ authJwt.verifyToken,
  tarotController.getReadingById
);

// Premium routes - cần đăng nhập và tài khoản Premium

// Tạo kết quả bói bài với AI
router.post(
  '/readings/ai',
  [
    authJwt.verifyToken,
    // Bỏ middleware kiểm tra premium
    // (req, res, next) => {
    //   if (!req.user || !req.user.is_premium) {
    //     return res.status(403).json({
    //       status: 'error',
    //       message: 'Premium feature - Premium account required'
    //     });
    //   }
    //   next();
    // },
    // Cho phép cả hai format API mới và cũ
    body(['topic_id', 'topicId']).optional().isInt().withMessage('Topic ID must be an integer'),
    body(['spread_id', 'spreadId']).optional().isInt().withMessage('Spread ID must be an integer'),
    body('question').notEmpty().withMessage('Question is required for AI reading'),
    
    // Cho phép cả hai loại format của cards
    body(['selected_cards', 'selectedCards']).optional().isArray().withMessage('Selected cards must be an array'),
    body('selectedIndices').optional().isArray().withMessage('Selected indices must be an array'),
    body('displayedCards').optional().isArray().withMessage('Displayed cards must be an array'),
    
    body('type').optional().isString().withMessage('Type must be a string'),
    body('domain').optional().isString(),
    body('useAI').optional().isBoolean(),
    
    // Custom validation để đảm bảo ít nhất một trong các format cards được cung cấp
    (req, res, next) => {
      // Kiểm tra xem có ít nhất một trong các format cards không
      if (
        (req.body.selected_cards && Array.isArray(req.body.selected_cards)) ||
        (req.body.selectedCards && Array.isArray(req.body.selectedCards)) ||
        (req.body.selectedIndices && Array.isArray(req.body.selectedIndices) && req.body.displayedCards && Array.isArray(req.body.displayedCards))
      ) {
        return next(); // Tiếp tục nếu có ít nhất một format
      }
      
      return res.status(400).json({
        status: 'error',
        message: 'At least one card selection format is required (selected_cards, selectedCards, or selectedIndices+displayedCards)'
      });
    }
  ],
  tarotController.createAIReading
);

// Thêm route mới cho cấu trúc API mới
router.post(
  '/',
  [
    // Bỏ authJwt.verifyToken,
    body('topic_id').isInt().withMessage('Topic ID must be an integer'),
    body('spread_id').isInt().withMessage('Spread ID must be an integer'),
    body('question').optional().isString().withMessage('Question must be a string'),
    body('selected_cards').isArray().withMessage('Selected cards must be an array'),
    body('type').isString().withMessage('Type must be a string'),
    validate
  ],
  tarotController.createReading
);

// Thêm route mới cho AI reading với cấu trúc API mới
router.post(
  '/ai',
  [
    // Bỏ authJwt.verifyToken,
    // Bỏ kiểm tra premium
    // (req, res, next) => {
    //   if (!req.user || !req.user.is_premium) {
    //     return res.status(403).json({
    //       status: 'error',
    //       message: 'Premium feature - Premium account required'
    //     });
    //   }
    //   next();
    // },
    
    // Cho phép cả hai format API mới và cũ
    body(['topic_id', 'topicId']).optional().isInt().withMessage('Topic ID must be an integer'),
    body(['spread_id', 'spreadId']).optional().isInt().withMessage('Spread ID must be an integer'),
    body('question').notEmpty().withMessage('Question is required for AI reading'),
    
    // Cho phép cả hai loại format của cards
    body(['selected_cards', 'selectedCards']).optional().isArray().withMessage('Selected cards must be an array'),
    body('selectedIndices').optional().isArray().withMessage('Selected indices must be an array'),
    body('displayedCards').optional().isArray().withMessage('Displayed cards must be an array'),
    
    body('type').optional().isString().withMessage('Type must be a string'),
    body('domain').optional().isString(),
    body('useAI').optional().isBoolean(),
    
    // Custom validation để đảm bảo ít nhất một trong các format cards được cung cấp
    (req, res, next) => {
      // Kiểm tra xem có ít nhất một trong các format cards không
      if (
        (req.body.selected_cards && Array.isArray(req.body.selected_cards)) ||
        (req.body.selectedCards && Array.isArray(req.body.selectedCards)) ||
        (req.body.selectedIndices && Array.isArray(req.body.selectedIndices) && req.body.displayedCards && Array.isArray(req.body.displayedCards))
      ) {
        return next(); // Tiếp tục nếu có ít nhất một format
      }
      
      return res.status(400).json({
        status: 'error',
        message: 'At least one card selection format is required (selected_cards, selectedCards, or selectedIndices+displayedCards)'
      });
    }
  ],
  tarotController.createAIReading
);

// Lưu kết quả bói bài vào lịch sử
router.post(
  '/readings/save',
  [authJwt.verifyToken],
  tarotController.saveReading
);

module.exports = router; 