/**
 * Payment Service
 * Xử lý logic thanh toán và tương tác với database
 */

const zalopayUtils = require('../utils/zalopay.utils');
const db = require('../models');
const { Sequelize } = db;

/**
 * Tạo đơn hàng mới trong hệ thống và ZaloPay
 * @param {object} orderData Thông tin đơn hàng
 * @returns {Promise<object>} Kết quả tạo đơn hàng
 */
const createPayment = async (orderData) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { amount, planType, userId, email, name } = orderData;
    
    // Xác định số tiền dựa trên loại gói
    let finalAmount = amount;
    if (!finalAmount) {
      finalAmount = planType === 'yearly' ? 999000 : 99000;
    }
    
    // Tạo mô tả cho đơn hàng
    const description = `Thanh toán gói ${planType === 'yearly' ? 'năm' : 'tháng'} - Bói Tarot Premium`;
    
    // Tạo đơn hàng trên ZaloPay
    const zalopayOrder = await zalopayUtils.createOrder({
      amount: finalAmount,
      description,
      userId,
      email: email || 'user@example.com', // Đảm bảo có giá trị mặc định
      name: name || 'User', // Đảm bảo có giá trị mặc định
      planType
    });
    
    if (!zalopayOrder.success) {
      await transaction.rollback();
      return {
        success: false,
        message: 'Không thể tạo đơn hàng trên ZaloPay',
        error: zalopayOrder.error
      };
    }
    
    // Lấy mã giao dịch từ cả response và orderInfo để đảm bảo tính nhất quán
    const transactionId = zalopayOrder.data.app_trans_id || zalopayOrder.orderInfo?.app_trans_id;
    
    // Lưu thông tin thanh toán vào database sử dụng model Payment
    try {
      await db.payments.create({
        user_id: userId,
        amount: finalAmount,
        currency: 'VND',
        status: 'pending',
        transaction_id: transactionId,
        payment_method: 'zalopay',
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });
      
      await transaction.commit();
    } catch (dbError) {
      await transaction.rollback();
      console.error('Database error when saving payment:', dbError);
      // Tiếp tục xử lý, không return lỗi
    }
    
    return {
      success: true,
      paymentUrl: zalopayOrder.data.order_url,
      orderId: transactionId,
      amount: finalAmount
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in createPayment service:', error);
    return {
      success: false,
      message: 'Lỗi khi tạo thanh toán',
      error: error.message
    };
  }
};

/**
 * Xử lý callback từ ZaloPay sau khi thanh toán
 * @param {object} callbackData Dữ liệu callback từ ZaloPay
 * @returns {Promise<object>} Kết quả xử lý callback
 */
const processZaloPayCallback = async (callbackData) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    // Cần kiểm tra xem app_trans_id có tồn tại và có đúng định dạng không
    const { app_trans_id } = callbackData;
    
    if (!app_trans_id) {
      await transaction.rollback();
      return {
        success: false,
        message: 'Mã giao dịch không hợp lệ'
      };
    }
    
    try {
      // Cập nhật trạng thái thanh toán trong database
      const payment = await db.payments.findOne({
        where: { transaction_id: app_trans_id }
      }, { transaction });
      
      if (!payment) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Không tìm thấy giao dịch'
        };
      }
      
      // Mặc định trạng thái thành công (vì callback chỉ được gọi khi thanh toán thành công)
      payment.status = 'completed';
      payment.updated_at = new Date();
      await payment.save({ transaction });
      
      // Cập nhật trạng thái premium cho user
      const user = await db.users.findByPk(payment.user_id, { transaction });
      
      if (user) {
        // Xác định thời hạn premium dựa trên số tiền
        const isPremiumYearly = payment.amount >= 900000;
        const premiumDuration = isPremiumYearly ? 365 : 30; // 365 ngày hoặc 30 ngày
        
        user.is_premium = true;
        user.premium_until = new Date(Date.now() + premiumDuration * 24 * 60 * 60 * 1000);
        await user.save({ transaction });
      }
      
      await transaction.commit();
      
      return {
        success: true,
        message: 'Xử lý callback thành công',
        status: 'completed'
      };
    } catch (dbError) {
      await transaction.rollback();
      console.error('Database error in processZaloPayCallback:', dbError);
      return {
        success: false,
        message: 'Lỗi database khi xử lý callback',
        error: dbError.message
      };
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in processZaloPayCallback service:', error);
    return {
      success: false,
      message: 'Lỗi khi xử lý callback',
      error: error.message
    };
  }
};

/**
 * Cập nhật trạng thái thanh toán từ ZaloPay
 * @param {string} appTransId Mã giao dịch
 * @param {object} statusData Dữ liệu trạng thái từ ZaloPay
 * @returns {Promise<object>} Kết quả cập nhật
 */
const updatePaymentStatusFromZaloPay = async (appTransId, statusData) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    // Kiểm tra trạng thái thanh toán
    const isSuccess = statusData.return_code === 1;
    
    // Cập nhật trạng thái trong database
    const payment = await db.payments.findOne({
      where: { transaction_id: appTransId }
    }, { transaction });
    
    if (!payment) {
      await transaction.rollback();
      return {
        success: false,
        message: 'Không tìm thấy giao dịch'
      };
    }
    
    // Cập nhật trạng thái thanh toán
    payment.status = isSuccess ? 'completed' : 'failed';
    payment.updated_at = new Date();
    await payment.save({ transaction });
    
    // Nếu thanh toán thành công, cập nhật trạng thái premium cho user
    if (isSuccess) {
      const user = await db.users.findByPk(payment.user_id, { transaction });
      
      if (user) {
        // Xác định thời hạn premium dựa trên số tiền
        const isPremiumYearly = payment.amount >= 900000;
        const premiumDuration = isPremiumYearly ? 365 : 30; // 365 ngày hoặc 30 ngày
        
        user.is_premium = true;
        user.premium_until = new Date(Date.now() + premiumDuration * 24 * 60 * 60 * 1000);
        await user.save({ transaction });
      }
    }
    
    await transaction.commit();
    
    return {
      success: true,
      status: payment.status
    };
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error in updatePaymentStatusFromZaloPay:', error);
    return {
      success: false,
      message: 'Lỗi khi cập nhật trạng thái thanh toán',
      error: error.message
    };
  }
};

module.exports = {
  createPayment,
  processZaloPayCallback,
  updatePaymentStatusFromZaloPay
}; 