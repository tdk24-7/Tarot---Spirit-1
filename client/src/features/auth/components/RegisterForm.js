// src/components/auth/RegisterModal.js
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from '../hook/useAuth';
import { path } from '../../../shared/utils/routes';
import FacebookLoginButton from './FacebookLoginButton';
import GoogleLoginButton from './GoogleLoginButton';
import { 
  ModalHeader, 
  InputField, 
  CheckboxField, 
  AuthButton, 
  Divider, 
  ModalWrapper,
  ErrorAlert,
  BottomLink
} from './AuthComponents';

// Main RegisterForm component
const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, loading, error, clearAuthError } = useAuth();

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
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }
    
    setPasswordError("");
    
    if (name && email && password && agreeTerms) {
      setIsSubmitting(true);
      console.log("Đang gửi yêu cầu đăng ký...");
      
      // Chuyển đổi name thành username theo yêu cầu API
      const userData = {
        username: name, // Server cần username, không phải name
        email,
        password
      };
      
      console.log("Dữ liệu đăng ký:", userData);
      
      try {
        const success = await register(userData);
        console.log("Kết quả đăng ký:", success);
        if (success) {
          console.log("Đăng ký thành công, chuyển hướng đến đăng nhập");
          onSwitchToLogin();
        }
      } catch (err) {
        console.error("Lỗi đăng ký:", err);
        // Hiển thị lỗi cụ thể từ server nếu có
        if (err && err.message) {
          setPasswordError(err.message);
        } else {
          setPasswordError("Đăng ký thất bại. Vui lòng thử lại sau.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSocialLoginSuccess = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSocialLoginFailure = (error) => {
    console.error("Social login failed:", error);
    // Bạn có thể dispatch một action để hiển thị lỗi cho người dùng nếu cần
    // dispatch(setAuthError(error.message || "Đăng nhập qua mạng xã hội thất bại."));
  };

  const modalContent = (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Đăng ký" onClose={onClose} />

      <ErrorAlert error={error || passwordError} />

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          id="name"
          label="Họ và tên"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Tên của bạn"
          delay={isLoaded ? '100ms' : '0ms'}
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Email của bạn"
          delay={isLoaded ? '200ms' : '0ms'}
        />

        <InputField
          id="password"
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Mật khẩu của bạn"
          delay={isLoaded ? '300ms' : '0ms'}
        />

        <InputField
          id="confirm-password"
          label="Xác nhận mật khẩu"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Nhập lại mật khẩu"
          delay={isLoaded ? '400ms' : '0ms'}
        />

        <CheckboxField
          id="terms"
          isChecked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          delay={isLoaded ? '500ms' : '0ms'}
          required={true}
        >
          Tôi đồng ý với{" "}
          <a href="#" className="text-[#9370db] hover:text-[#9370db]/80 transition-colors relative group tracking-vn-tight">
            Điều khoản dịch vụ
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#9370db]/50 group-hover:w-full transition-all duration-300"></span>
          </a>{" "}
          và{" "}
          <Link to={path.PUBLIC.PRIVACY_POLICY} className="text-[#9370db] hover:text-[#9370db]/80 transition-colors relative group tracking-vn-tight">
            Chính sách bảo mật
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#9370db]/50 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </CheckboxField>

        <AuthButton
          loading={isSubmitting}
          isLoaded={isLoaded}
          delay={isLoaded ? '600ms' : '0ms'}
        >
          Đăng ký
        </AuthButton>
      </form>

      <BottomLink
        isLoaded={isLoaded}
        delay={isLoaded ? '700ms' : '0ms'}
        text="Đã có tài khoản?"
        actionText="Đăng nhập"
        onClick={onSwitchToLogin}
      />

      <Divider text="Hoặc đăng ký với" />

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: isLoaded ? '800ms' : '0ms' }}>
        <FacebookLoginButton onLoginSuccess={handleSocialLoginSuccess} />
        <GoogleLoginButton onLoginSuccess={handleSocialLoginSuccess} onFailure={handleSocialLoginFailure} />
      </div>
    </ModalWrapper>
  );

  // Use Portal to render modal at root level of DOM
  return createPortal(modalContent, document.body);
};

export default RegisterForm;