/**
 * Payment Controller
 * Xử lý các request liên quan đến thanh toán
 */

const paymentService = require('../services/payment.service');
const zalopayUtils = require('../utils/zalopay.utils');
const qs = require('qs');
const axios = require('axios');
const zalopayConfig = require('../config/zalopay.config');

/**
 * Tạo thanh toán ZaloPay mới
 * @param {object} req Request object
 * @param {object} res Response object
 */
const createZaloPayOrder = async (req, res) => {
  try {
    const { planType } = req.body;
    
    // Đảm bảo có userId
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại'
      });
    }
    
    const userId = req.user.id;
    
    if (!planType) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin gói dịch vụ'
      });
    }
    
    // Lấy thông tin user từ req.user (đã được set bởi middleware xác thực)
    let email = 'user@example.com';
    let name = 'User';
    
    if (req.user.email) {
      email = req.user.email;
    }
    
    if (req.user.username) {
      name = req.user.username;
    }
    
    const result = await paymentService.createPayment({
      planType,
      userId,
      email,
      name
    });
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in createZaloPayOrder controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo thanh toán',
      error: error.message
    });
  }
};

/**
 * Xử lý callback từ ZaloPay
 * @param {object} req Request object
 * @param {object} res Response object
 */
const zaloPayCallback = async (req, res) => {
  try {
    console.log('ZaloPay callback received:', req.body);
    
    // Kiểm tra callback từ ZaloPay
    const verifyResult = zalopayUtils.verifyCallback(req.body);
    
    if (!verifyResult.isValid) {
      return res.status(200).json({
        return_code: verifyResult.returnCode,
        return_message: verifyResult.returnMessage
      });
    }
    
    // Cập nhật trạng thái thanh toán trong DB
    const result = await paymentService.processZaloPayCallback(verifyResult.data);
    
    // ZaloPay yêu cầu phản hồi cụ thể
    return res.status(200).json({
      return_code: result.success ? 1 : 0,
      return_message: result.success ? 'success' : result.message
    });
  } catch (error) {
    console.error('Error in zaloPayCallback controller:', error);
    return res.status(200).json({
      return_code: 0,
      return_message: 'Server error'
    });
  }
};

/**
 * Kiểm tra trạng thái thanh toán
 * @param {object} req Request object
 * @param {object} res Response object
 */
const checkPaymentStatus = async (req, res) => {
  try {
    const { app_trans_id } = req.params;
    
    if (!app_trans_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu mã giao dịch'
      });
    }
    
    // Gọi API check trạng thái thanh toán của ZaloPay
    const postData = {
      app_id: zalopayConfig.appId,
      app_trans_id
    };
    
    const data = postData.app_id + '|' + postData.app_trans_id + '|' + zalopayConfig.key1;
    postData.mac = zalopayUtils.hmacSHA256(data, zalopayConfig.key1);
    
    const postConfig = {
      method: 'post',
      url: zalopayConfig.endpoint.getOrderStatus,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(postData)
    };
    
    try {
      const response = await axios(postConfig);
      console.log('ZaloPay status check response:', response.data);
      
      const isSuccess = response.data.return_code === 1;
      
      if (isSuccess) {
        // Cập nhật trạng thái thanh toán trong hệ thống
        await paymentService.updatePaymentStatusFromZaloPay(app_trans_id, response.data);
      }
      
      return res.status(200).json({
        success: isSuccess,
        data: response.data
      });
    } catch (apiError) {
      console.error('Error calling ZaloPay API:', apiError);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra trạng thái thanh toán với ZaloPay',
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('Error in checkPaymentStatus controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra trạng thái thanh toán',
      error: error.message
    });
  }
};

module.exports = {
  createZaloPayOrder,
  zaloPayCallback,
  checkPaymentStatus
}; 