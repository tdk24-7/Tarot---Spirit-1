import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from '../hook/useAuth';
import { 
  ModalHeader, 
  InputField, 
  AuthButton, 
  ModalWrapper,
  ErrorAlert,
  BottomLink,
  Icon
} from './AuthComponents';

// Main ForgotPasswordForm component
const ForgotPasswordForm = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { requestPasswordReset, clearAuthError } = useAuth();

  // Prevent scroll when modal is visible
  useEffect(() => {
    // Save initial scroll position
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.paddingRight = '15px'; // Prevent layout shift
    
    setIsLoaded(true);
    
    // Clean up when component unmounts
    return () => {
      // Restore initial scroll position
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.paddingRight = '';
      window.scrollTo(scrollX, scrollY);
      setIsLoaded(false);
      clearAuthError(); // Clear any auth errors when unmounting
    };
  }, [clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setError(null);
      
      try {
        await requestPasswordReset(email);
        setIsSubmitted(true);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu khôi phục mật khẩu');
      } finally {
        setLoading(false);
      }
    }
  };

  const SuccessState = () => (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon
          name="Check"
          size="lg"
          className="text-green-500"
        />
      </div>
      <h3 className="text-xl text-white font-medium mb-2 tracking-vn-tight">Kiểm tra email của bạn</h3>
      <p className="text-gray-300 mb-6 tracking-vn-tight">
        Chúng tôi đã gửi email hướng dẫn khôi phục mật khẩu đến {email}. Vui lòng kiểm tra hộp thư đến và thư rác của bạn.
      </p>
      <button
        onClick={onSwitchToLogin}
        className="inline-flex items-center text-[#9370db] hover:text-[#9370db]/80 transition-colors tracking-vn-tight"
      >
        <Icon
          name="ArrowLeft"
          size="xs"
          className="mr-1"
        />
        Quay lại đăng nhập
      </button>
    </div>
  );

  const modalContent = (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Khôi phục mật khẩu" onClose={onClose} />
      
      {!isSubmitted ? (
        <>
          <ErrorAlert error={error} />
          
          <p className="text-gray-300 mb-6 tracking-vn-tight">
            Vui lòng nhập địa chỉ email bạn đã dùng để đăng ký. Chúng tôi sẽ gửi email hướng dẫn đặt lại mật khẩu.
          </p>
        
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              delay={isLoaded ? '100ms' : '0ms'}
            />

            <AuthButton
              loading={loading}
              isLoaded={isLoaded}
              delay={isLoaded ? '200ms' : '0ms'}
            >
              Gửi yêu cầu
            </AuthButton>
          </form>
          
          <BottomLink
            isLoaded={isLoaded}
            delay={isLoaded ? '300ms' : '0ms'}
            text=""
            actionText="Quay lại đăng nhập"
            onClick={onSwitchToLogin}
          />
        </>
      ) : (
        <SuccessState />
      )}
    </ModalWrapper>
  );

  // Use createPortal to render the modal at the end of the document body
  return createPortal(modalContent, document.body);
};

export default ForgotPasswordForm; 