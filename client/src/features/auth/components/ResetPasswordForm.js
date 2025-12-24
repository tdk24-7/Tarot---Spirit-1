import React, { useState, useEffect, memo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../hook/useAuth';
import { 
  ModalHeader, 
  InputField, 
  AuthButton, 
  ModalWrapper,
  ErrorAlert,
  Icon
} from './AuthComponents';

// Form password check component
const PasswordRequirement = memo(({ met, children }) => (
  <div className="flex items-center text-sm gap-1.5">
    <span className={`h-4 w-4 rounded-full flex items-center justify-center ${met ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
      {met ? (
        <Icon
          name="Check"
          size="xs"
        />
      ) : (
        <Icon
          name="Plus"
          size="xs"
        />
      )}
    </span>
    <span className={`${met ? 'text-gray-300' : 'text-gray-500'} tracking-vn-tight`}>{children}</span>
  </div>
));

// Main ResetPasswordForm component
const ResetPasswordForm = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const { resetPassword, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  // Password requirements
  const requirements = [
    { id: 'length', label: 'Ít nhất 8 ký tự', met: password.length >= 8 },
    { id: 'lowercase', label: 'Ít nhất 1 chữ thường', met: /[a-z]/.test(password) },
    { id: 'uppercase', label: 'Ít nhất 1 chữ hoa', met: /[A-Z]/.test(password) },
    { id: 'number', label: 'Ít nhất 1 số', met: /[0-9]/.test(password) },
    { id: 'special', label: 'Ít nhất 1 ký tự đặc biệt', met: /[^A-Za-z0-9]/.test(password) },
    { id: 'match', label: 'Mật khẩu khớp nhau', met: password && confirmPassword && password === confirmPassword }
  ];

  const isPasswordValid = requirements.every(req => req.met);

  // Extract token from URL params
  useEffect(() => {
    if (params.token) {
      setToken(params.token);
    }
  }, [params]);

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
    if (isPasswordValid) {
      setLoading(true);
      setError(null);
      
      try {
        await resetPassword(token, password);
        setIsSubmitted(true);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
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
      <h3 className="text-xl text-white font-medium mb-2 tracking-vn-tight">Mật khẩu đã được đặt lại</h3>
      <p className="text-gray-300 mb-6 tracking-vn-tight">
        Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới.
      </p>
      <button
        onClick={handleGoToLogin}
        className="inline-flex items-center justify-center px-4 py-2 bg-[#9370db] text-white rounded-lg hover:bg-[#9370db]/90 transition-colors tracking-vn-tight"
      >
        Đăng nhập ngay
      </button>
    </div>
  );

  const RequirementsList = () => (
    <div className={`mt-4 p-3 bg-white/5 rounded-lg border border-white/10 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
      <h3 className="text-white text-sm font-medium mb-2 tracking-vn-tight">Yêu cầu mật khẩu:</h3>
      <div className="grid grid-cols-1 gap-2">
        {requirements.map((req) => (
          <PasswordRequirement key={req.id} met={req.met}>
            {req.label}
          </PasswordRequirement>
        ))}
      </div>
    </div>
  );

  const modalContent = (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Đặt lại mật khẩu" onClose={onClose} />

      {!isSubmitted ? (
        <>
          <ErrorAlert error={error} />
          
          <p className="text-gray-300 mb-6 tracking-vn-tight">
            Vui lòng nhập mật khẩu mới của bạn. Mật khẩu cần đáp ứng các yêu cầu bảo mật.
          </p>
        
          <form className="space-y-5" onSubmit={handleSubmit}>
            <InputField
              id="password"
              label="Mật khẩu mới"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              delay={isLoaded ? '100ms' : '0ms'}
            />

            <InputField
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              delay={isLoaded ? '200ms' : '0ms'}
            />

            <RequirementsList />

            <AuthButton
              loading={loading}
              isLoaded={isLoaded}
              delay={isLoaded ? '400ms' : '0ms'}
              disabled={!isPasswordValid}
            >
              Đặt lại mật khẩu
            </AuthButton>
          </form>
        </>
      ) : (
        <SuccessState />
      )}
    </ModalWrapper>
  );

  // Use createPortal to render the modal at the end of the document body
  return createPortal(modalContent, document.body);
};

export default ResetPasswordForm; 