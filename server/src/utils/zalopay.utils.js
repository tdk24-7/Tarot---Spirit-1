/**
 * ZaloPay Utilities
 * Các hàm tiện ích để tương tác với ZaloPay API
 */

const CryptoJS = require('crypto-js');
const axios = require('axios');
const moment = require('moment');
const qs = require('qs');
const zalopayConfig = require('../config/zalopay.config');

/**
 * Tạo chuỗi HmacSHA256 từ data và key
 * @param {string} data Dữ liệu cần mã hóa
 * @param {string} key Khóa bí mật
 * @returns {string} Chuỗi HmacSHA256 đã mã hóa
 */
const hmacSHA256 = (data, key) => {
  return CryptoJS.HmacSHA256(data, key).toString();
};

/**
 * Tạo mã đơn hàng ngẫu nhiên
 * @returns {string} Mã đơn hàng
 */
const generateTransID = () => {
  return Math.floor(Math.random() * 1000000);
};

/**
 * Tạo đơn hàng trên ZaloPay
 * @param {object} orderData Thông tin đơn hàng
 * @returns {Promise<object>} Kết quả tạo đơn hàng
 */
const createOrder = async (orderData) => {
  try {
    const { amount, description, userId, email, name, planType } = orderData;
    
    // Đảm bảo amount là số nguyên dương
    let finalAmount = parseInt(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      // Xác định số tiền mặc định dựa trên loại gói
      finalAmount = planType === 'yearly' ? 999000 : 99000;
    }

    // Đảm bảo các trường bắt buộc có giá trị hợp lệ
    const safeUserId = userId?.toString() || 'user_anonymous';
    const safeEmail = email || 'user@example.com';
    const safeName = name || 'User';
    const safePlanType = planType || 'monthly';
    const safeDescription = description || `Thanh toán dịch vụ cao cấp - ${safePlanType}`;
    
    // Tạo transID cho đơn hàng
    const transID = generateTransID();

    // Tạo embeddata
    const embed_data = {
      redirecturl: zalopayConfig.callback.returnUrl,
      email: safeEmail,
      name: safeName
    };

    // Tạo items array (có thể để trống)
    const items = [{
      itemid: safePlanType,
      itemname: `Gói ${safePlanType === 'yearly' ? 'năm' : 'tháng'}`,
      itemprice: finalAmount,
      itemquantity: 1
    }];

    // Tạo đơn hàng
    const order = {
      app_id: zalopayConfig.appId,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: safeUserId,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: finalAmount,
      description: safeDescription,
      bank_code: '', // Để trống để hiển thị tất cả các phương thức thanh toán
      callback_url: zalopayConfig.callback.ipnUrl
    };

    // Tạo chữ ký (mac)
    const data = 
      order.app_id + "|" + 
      order.app_trans_id + "|" + 
      order.app_user + "|" + 
      order.amount + "|" + 
      order.app_time + "|" + 
      order.embed_data + "|" + 
      order.item;
      
    order.mac = hmacSHA256(data, zalopayConfig.key1);
    
    console.log('ZaloPay request payload:', JSON.stringify(order));

    // Gọi API tạo đơn hàng (sử dụng params như trong demo)
    const response = await axios.post(zalopayConfig.endpoint.createOrder, null, { params: order });
    
    console.log('ZaloPay API response:', JSON.stringify(response.data));
    
    return {
      success: response.data.return_code === 1,
      data: response.data,
      orderInfo: order
    };
  } catch (error) {
    console.error('Error creating ZaloPay order:', error);
    if (error.response) {
      console.error('ZaloPay API error response:', error.response.data);
    }
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Kiểm tra trạng thái đơn hàng
 * @param {string} appTransId Mã giao dịch
 * @returns {Promise<object>} Kết quả kiểm tra
 */
const getOrderStatus = async (appTransId) => {
  try {
    // Tạo payload
    const postData = {
      app_id: zalopayConfig.appId,
      app_trans_id: appTransId
    };
    
    // Tạo mac
    const data = postData.app_id + '|' + postData.app_trans_id + '|' + zalopayConfig.key1;
    postData.mac = hmacSHA256(data, zalopayConfig.key1);
    
    // Cấu hình request
    const postConfig = {
      method: 'post',
      url: zalopayConfig.endpoint.getOrderStatus,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(postData)
    };
    
    // Gọi API
    const response = await axios(postConfig);
    
    return {
      success: response.data.return_code === 1,
      data: response.data
    };
  } catch (error) {
    console.error('Error getting order status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Xác thực callback từ ZaloPay
 * @param {object} callbackData Dữ liệu callback
 * @returns {object} Kết quả xác thực
 */
const verifyCallback = (callbackData) => {
  try {
    const dataStr = callbackData.data;
    const reqMac = callbackData.mac;
    
    const mac = hmacSHA256(dataStr, zalopayConfig.key2);
    
    // Kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      return {
        isValid: false,
        returnCode: -1,
        returnMessage: 'mac not equal'
      };
    }
    
    // Giải mã dữ liệu
    const dataJson = JSON.parse(dataStr);
    
    return {
      isValid: true,
      returnCode: 1,
      returnMessage: 'success',
      data: dataJson
    };
  } catch (error) {
    console.error('Error verifying ZaloPay callback:', error);
    return {
      isValid: false,
      returnCode: 0, // ZaloPay server sẽ callback lại (tối đa 3 lần)
      returnMessage: error.message
    };
  }
};

module.exports = {
  createOrder,
  getOrderStatus,
  verifyCallback,
  generateTransID,
  hmacSHA256
}; 