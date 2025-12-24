/**
 * Payment Routes
 * Định nghĩa các routes cho thanh toán
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { auth } = require('../middleware');

// API tạo thanh toán ZaloPay - yêu cầu đăng nhập
router.post('/zalopay/create', auth.authenticate, paymentController.createZaloPayOrder);

// API callback từ ZaloPay - không yêu cầu đăng nhập
router.post('/zalopay-callback', paymentController.zaloPayCallback);

// API kiểm tra trạng thái thanh toán - yêu cầu đăng nhập
router.get('/status/:app_trans_id', auth.authenticate, paymentController.checkPaymentStatus);

module.exports = router; 