import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import { motion } from 'framer-motion';
import ZaloLogo from '../../assets/images/logo/Zalo.jpeg';
import axios from 'axios';
import { path } from '../../shared/utils/routes';

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

// Payment Method Component
const PaymentMethod = ({ id, name, logo, description, selected, onSelect }) => (
  <div 
    className={`p-4 rounded-lg cursor-pointer transition-all ${
      selected === id 
        ? 'bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] border border-purple-500/60' 
        : 'bg-white/5 border border-white/10 hover:bg-white/10'
    }`}
    onClick={() => onSelect(id)}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-md">
        <img src={logo} alt={name} className="w-6 h-6 object-contain" />
      </div>
      <div>
        <h3 className="font-medium text-white">{name}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  </div>
);

// Plan Option Component
const PlanOption = ({ id, name, price, description, billing, selected, onSelect }) => (
  <div 
    className={`p-4 rounded-lg cursor-pointer transition-all ${
      selected === id 
        ? 'bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] border border-purple-500/60' 
        : 'bg-white/5 border border-white/10 hover:bg-white/10'
    }`}
    onClick={() => onSelect(id)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium text-white">{name}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold text-white">{price}</div>
        <div className="text-sm text-gray-300">{billing}</div>
      </div>
    </div>
  </div>
);

// Main Component
const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);
  
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);

  // Check if there's a pending transaction when component mounts
  useEffect(() => {
    const storedTransactionId = localStorage.getItem('paymentTransactionId');
    
    if (storedTransactionId) {
      setTransactionId(storedTransactionId);
      checkPaymentStatus(storedTransactionId);
    }
    
    return () => {
      // Clear any interval when component unmounts
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, []);

  // Xử lý thanh toán với ZaloPay
  const processPayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/payments/zalopay/create`, 
        { planType: selectedPlan },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        // Lưu thông tin giao dịch để kiểm tra sau này
        const orderId = response.data.orderId;
        setTransactionId(orderId);
        localStorage.setItem('paymentTransactionId', orderId);
        localStorage.setItem('paymentPlanType', selectedPlan);
        
        // Thiết lập kiểm tra trạng thái định kỳ
        const checkInterval = setInterval(() => {
          checkPaymentStatus(orderId);
        }, 5000); // Kiểm tra mỗi 5 giây
        
        setStatusCheckInterval(checkInterval);
        
        // Mở cửa sổ thanh toán ZaloPay
        window.location.href = response.data.paymentUrl;
      } else {
        setError('Không thể tạo thanh toán. Vui lòng thử lại sau.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
      setIsProcessing(false);
    }
  };

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatus = async (orderId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/payments/status/${orderId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        // Thanh toán thành công
        if (response.data.data.return_code === 1) {
          // Xóa ID giao dịch khỏi localStorage
          localStorage.removeItem('paymentTransactionId');
          localStorage.removeItem('paymentPlanType');
          
          // Dừng kiểm tra trạng thái
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
          }
          
          // Chuyển hướng đến trang thành công
          navigate('/payment-success', { 
            state: { 
              amount: response.data.data.amount,
              transactionId: orderId
            } 
          });
        }
      } else {
        console.log('Payment still pending or failed');
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Gói Premium Hàng Tháng',
      price: '99.000đ',
      description: 'Truy cập đầy đủ tính năng Premium',
      billing: 'Thanh toán hàng tháng'
    },
    {
      id: 'yearly',
      name: 'Gói Premium Hàng Năm',
      price: '999.000đ',
      description: 'Truy cập đầy đủ tính năng Premium (Tiết kiệm 15%)',
      billing: 'Thanh toán hàng năm'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Thanh Toán | Bói Tarot</title>
        <meta name="description" content="Thanh toán để nâng cấp lên tài khoản Premium và mở khóa tất cả các tính năng cao cấp." />
      </Helmet>
      
      <MysticBackground />
      <Navbar />
      
      <section className="relative pt-32 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-6 text-center tracking-vn-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Thanh Toán <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9370db] to-[#8a2be2]">Premium</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-300 mb-12 text-center tracking-vn-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Chỉ còn một bước nữa để mở khóa tất cả các tính năng cao cấp.
          </motion.p>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 shadow-xl">
            {/* Transaction status message */}
            {transactionId && (
              <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-300">
                <p className="font-medium mb-2">Bạn có một giao dịch đang xử lý</p>
                <p className="text-sm mb-2">Mã giao dịch: {transactionId}</p>
                <p className="text-sm">Hệ thống đang kiểm tra trạng thái thanh toán. Vui lòng đợi trong giây lát hoặc tiếp tục thanh toán nếu bạn chưa hoàn tất.</p>
              </div>
            )}
            
            {/* Plan Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Chọn gói dịch vụ</h2>
              <div className="space-y-3">
                {plans.map(plan => (
                  <PlanOption
                    key={plan.id}
                    id={plan.id}
                    name={plan.name}
                    price={plan.price}
                    description={plan.description}
                    billing={plan.billing}
                    selected={selectedPlan}
                    onSelect={setSelectedPlan}
                  />
                ))}
              </div>
            </div>
            
            {/* Payment Method - ZaloPay Only */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] border border-purple-500/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md p-1">
                    <img src={ZaloLogo} alt="ZaloPay" className="w-full h-full object-contain rounded" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">ZaloPay</h3>
                    <p className="text-sm text-gray-300">Thanh toán nhanh chóng và an toàn qua ZaloPay</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ZaloPay Instructions */}
            <div className="mb-8 p-4 border border-purple-500/30 rounded-lg bg-purple-500/10">
              <h3 className="font-medium text-purple-300 mb-2">Hướng dẫn thanh toán qua ZaloPay</h3>
              <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                <li>Sau khi nhấn "Thanh toán", bạn sẽ được chuyển đến cổng thanh toán ZaloPay</li>
                <li>Quét mã QR bằng ứng dụng ZaloPay hoặc đăng nhập vào tài khoản ZaloPay của bạn</li>
                <li>Xác nhận thanh toán trên ứng dụng ZaloPay</li>
                <li>Sau khi thanh toán thành công, bạn sẽ được chuyển hướng trở lại trang web</li>
              </ul>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300">
                {error}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button 
                onClick={() => navigate('/premium-services')}
                className="px-6 py-3 rounded-lg font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                disabled={isProcessing}
              >
                Quay lại
              </button>
              
              <button 
                onClick={processPayment}
                disabled={isProcessing}
                className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Thanh toán'
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>Bằng cách tiếp tục, bạn đồng ý với <a href={path.PUBLIC.TERMS} className="text-purple-400 hover:underline" data-discover="true">Điều khoản dịch vụ</a> và <a href={path.PUBLIC.PRIVACY_POLICY} className="text-purple-400 hover:underline" data-discover="true">Chính sách bảo mật</a> của chúng tôi.</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PaymentPage; 