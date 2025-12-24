/**
 * ZaloPay Config
 * Sử dụng thông tin từ ZaloPay Sandbox để kiểm thử
 * Khi chuyển sang môi trường production, cần thay đổi các thông số này
 */

module.exports = {
  // Thông tin Sandbox - cần thay đổi khi đăng ký Merchant thực tế
  appId: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  
  // Các endpoint của ZaloPay API
  endpoint: {
    createOrder: "https://sb-openapi.zalopay.vn/v2/create",
    gateway: "https://sbgateway.zalopay.vn/pay?order=",
    quickPay: "https://sb-openapi.zalopay.vn/v2/quickpay",
    refund: "https://sb-openapi.zalopay.vn/v2/refund",
    getRefund: "https://sb-openapi.zalopay.vn/v2/query_refund",
    getOrderStatus: "https://sb-openapi.zalopay.vn/v2/query"
  },
  
  // Các cài đặt callback
  callback: {
    // Đường dẫn callback mặc định khi thanh toán thành công 
    // (thay thế bằng URL frontend thực tế)
    returnUrl: "http://localhost:3000/payment-success",
    // Đường dẫn ZaloPay sẽ gọi đến để thông báo kết quả thanh toán
    // (thay thế bằng URL backend thực tế khi triển khai)
    ipnUrl: "http://localhost:5001/api/payments/zalopay-callback"
  }
}; 