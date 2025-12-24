import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import { motion } from 'framer-motion';
import axios from 'axios';

// Decorative Elements
const MysticBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#9370db]/10 rounded-full filter blur-[80px] animate-pulse-slow"></div>
    <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-[#8a2be2]/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full animate-twinkle"></div>
    <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
  </div>
);

// Main Component
const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);
  
  const [paymentStatus, setPaymentStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Get URL search params
  const searchParams = new URLSearchParams(location.search);
  const urlAmount = searchParams.get('amount');
  const urlTransactionId = searchParams.get('apptransid');
  const urlStatus = searchParams.get('status');
  
  // Lấy thông tin từ location state, URL params, hoặc localStorage
  const transactionId = urlTransactionId || location.state?.transactionId || localStorage.getItem('paymentTransactionId');
  const amount = urlAmount || location.state?.amount;
  const planType = localStorage.getItem('paymentPlanType');
  
  // Kiểm tra trạng thái thanh toán
  useEffect(() => {
    // Check for URL parameters first (ZaloPay redirect)
    if (urlStatus === '1' && urlTransactionId) {
      setPaymentStatus('completed');
      setPaymentData({
        amount: parseInt(urlAmount) || 0,
        transaction_id: urlTransactionId
      });
      // Xóa thông tin thanh toán từ localStorage
      localStorage.removeItem('paymentTransactionId');
      localStorage.removeItem('paymentPlanType');
      return;
    }
    
    // Nếu đã có data từ location state, đã xác nhận thanh toán thành công
    if (location.state?.transactionId && location.state?.amount) {
      setPaymentStatus('completed');
      setPaymentData({
        amount: location.state.amount,
        transaction_id: location.state.transactionId
      });
      // Xóa thông tin thanh toán từ localStorage
      localStorage.removeItem('paymentTransactionId');
      localStorage.removeItem('paymentPlanType');
      return;
    }
    
    const verifyPayment = async () => {
      try {
        if (!transactionId) {
          setPaymentStatus('failed');
          setErrorMessage('Không tìm thấy thông tin giao dịch');
          return;
        }
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/payments/status/${transactionId}`,
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        // Kiểm tra kết quả từ ZaloPay API
        if (response.data.success && response.data.data.return_code === 1) {
          setPaymentStatus('completed');
          setPaymentData({
            amount: response.data.data.amount,
            transaction_id: transactionId
          });
          // Xóa thông tin thanh toán từ localStorage
          localStorage.removeItem('paymentTransactionId');
          localStorage.removeItem('paymentPlanType');
        } else {
          setPaymentStatus('failed');
          setErrorMessage('Thanh toán chưa hoàn tất hoặc đã bị hủy');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('failed');
        setErrorMessage('Lỗi khi kiểm tra trạng thái thanh toán');
      }
    };
    
    verifyPayment();
  }, [transactionId, token, location.state, urlStatus, urlTransactionId, urlAmount]);
  
  // Redirect to dashboard after 5 seconds if payment is successful
  useEffect(() => {
    let timer;
    if (paymentStatus === 'completed') {
      timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    }
    
    return () => clearTimeout(timer);
  }, [paymentStatus, navigate]);
  
  // Format thời gian hạn dùng Premium
  const formatPremiumExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(today);
    
    if (planType === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }
    
    return expiryDate.toLocaleDateString('vi-VN');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Thanh Toán | Bói Tarot</title>
        <meta name="description" content="Kết quả thanh toán nâng cấp tài khoản Premium." />
      </Helmet>
      
      <MysticBackground />
      <Navbar />
      
      <section className="relative pt-32 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-12 shadow-xl text-center">
            {paymentStatus === 'verifying' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 animate-spin rounded-full border-t-4 border-b-4 border-purple-500 mb-4"></div>
                <h2 className="text-2xl font-bold text-white mb-2">Đang xác thực thanh toán</h2>
                <p className="text-gray-300">Vui lòng đợi trong giây lát...</p>
              </div>
            )}
            
            {paymentStatus === 'completed' && (
              <>
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold mb-4 tracking-vn-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Thanh Toán Thành Công!
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-300 mb-8 tracking-vn-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Cảm ơn bạn đã nâng cấp lên tài khoản Premium.
                </motion.p>
                
                <div className="mb-8 p-6 border border-purple-500/30 rounded-lg bg-purple-500/10">
                  <h3 className="font-medium text-white mb-4">Chi tiết đơn hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-gray-400 text-sm">Gói dịch vụ:</p>
                      <p className="font-medium text-white">
                        {planType === 'yearly' ? 'Premium Hàng Năm' : 'Premium Hàng Tháng'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phương thức thanh toán:</p>
                      <p className="font-medium text-white">ZaloPay</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Ngày thanh toán:</p>
                      <p className="font-medium text-white">{new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Số tiền:</p>
                      <p className="font-medium text-white">{paymentData?.amount?.toLocaleString('vi-VN') || (planType === 'yearly' ? '999.000' : '99.000')} VNĐ</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Mã giao dịch:</p>
                      <p className="font-medium text-white">{paymentData?.transaction_id || transactionId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Có hiệu lực đến:</p>
                      <p className="font-medium text-white">{formatPremiumExpiry()}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-8">
                  Tài khoản của bạn đã được nâng cấp lên Premium. Bạn đã có thể truy cập tất cả các tính năng cao cấp.
                </p>
                
                <div>
                  <p className="text-gray-400 text-sm mb-4">Bạn sẽ được chuyển hướng tự động đến trang chủ sau 5 giây...</p>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                      Đi đến Trang Chủ
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {paymentStatus === 'failed' && (
              <>
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold mb-4 tracking-vn-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Thanh Toán Không Thành Công
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-red-300 mb-8 tracking-vn-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {errorMessage || 'Có lỗi xảy ra trong quá trình thanh toán'}
                </motion.p>
                
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => navigate('/payment')}
                    className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    Thử Lại
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 rounded-lg font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Về Trang Chủ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage; 