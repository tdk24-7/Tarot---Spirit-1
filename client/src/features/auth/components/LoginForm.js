// src/components/auth/LoginModal.js
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from '../hook/useAuth';
import FacebookLoginButton from './FacebookLoginButton';
import GoogleLoginButton from './GoogleLoginButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { path } from '../../../shared/utils/routes';
import { useDispatch } from 'react-redux';
import { loginAdmin, loginSuccess } from '../slices/authSlice';
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
import { toast } from 'react-hot-toast';

// Main LoginForm component
const LoginForm = ({ onClose, onSwitchToRegister, onSwitchToForgotPassword, message, redirectPath }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading, error: authError, clearAuthError, user } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get redirect path from props or location state
  const finalRedirectPath = redirectPath || location.state?.from || path.PROTECTED.PROFILE;
  const customMessage = message || location.state?.message || '';

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

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Check if this is an admin email (trong môi trường thực tế, điều này nên được xử lý bên server)
      const isAdminEmail = email.includes('@admin') || email.includes('admin@') || email.endsWith('@tarot.vn');

      let success;
      if (isAdminEmail) {
        // Nếu email có dạng admin, sử dụng loginAdmin từ slice trực tiếp
        const resultAction = await dispatch(loginAdmin({ email, password })).unwrap();
        console.log('Admin login result:', resultAction);

        if (resultAction.user && resultAction.user.isAdmin) {
          if (onClose) onClose();
          navigate('/admin/dashboard');
          success = true;
        } else {
          // Fallback to regular login if not actually an admin
          success = await login(email, password);
        }
      } else {
        // Regular login for regular users
        success = await login(email, password);
      }

      if (success && onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLoginSuccess = (result) => {
    console.log('Social login success data:', result);

    if (result && result.user && result.token) {
      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Dispatch action để cập nhật trạng thái đăng nhập trong Redux
      dispatch(loginSuccess({ user: result.user, token: result.token }));

      // Hiển thị thông báo thành công
      toast.success('Đăng nhập thành công!');

      // Chuyển hướng người dùng sau khi đăng nhập
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(finalRedirectPath);
      }

      // Đóng form nếu cần
      if (onClose) {
        onClose();
      }
    } else {
      console.error('Invalid login response structure:', result);
      setError('Dữ liệu đăng nhập không hợp lệ');
    }
  };

  const handleSocialLoginFailure = (error) => {
    console.error("Social login failed:", error);
    setError(error.message || "Đăng nhập qua mạng xã hội thất bại.");
    // Hoặc dispatch(setAuthError(errorMessage)); nếu bạn dùng Redux cho lỗi này
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Try both the passed callback and direct navigation
    if (onSwitchToForgotPassword) {
      onSwitchToForgotPassword();
    }

    // Direct navigation as fallback
    navigate(path.AUTH.FORGOT_PASSWORD, {
      state: { from: finalRedirectPath, message: customMessage }
    });

    // Close modal if it exists
    if (onClose) {
      onClose();
    }
  };

  const modalContent = (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="Đăng nhập" onClose={onClose} />

      <ErrorAlert error={error || authError} />

      {/* Message notification */}
      {customMessage && (
        <div className={`mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p>{customMessage}</p>
        </div>
      )}

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

        <InputField
          id="password"
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          rightLink="Quên mật khẩu?"
          onRightLinkClick={handleForgotPassword}
          delay={isLoaded ? '200ms' : '0ms'}
        />

        <CheckboxField
          id="remember-me"
          isChecked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          delay={isLoaded ? '300ms' : '0ms'}
          label="Nhớ đăng nhập"
        />

        <AuthButton
          loading={isSubmitting || loading}
          isLoaded={isLoaded}
          delay={isLoaded ? '400ms' : '0ms'}
        >
          Đăng nhập
        </AuthButton>
      </form>

      <Divider text="Hoặc tiếp tục với" />

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: isLoaded ? '500ms' : '0ms' }}>
        {/* Facebook login button */}
        <FacebookLoginButton onLoginSuccess={handleSocialLoginSuccess} />
        {/* Google login button */}
        <GoogleLoginButton onLoginSuccess={handleSocialLoginSuccess} onFailure={handleSocialLoginFailure} />
      </div>

      <BottomLink
        isLoaded={isLoaded}
        delay={isLoaded ? '600ms' : '0ms'}
        text="Chưa có tài khoản?"
        actionText="Đăng ký"
        onClick={onSwitchToRegister}
      />
    </ModalWrapper>
  );

  // Use createPortal to render the modal at the end of the document body
  return createPortal(modalContent, document.body);
};

export default LoginForm;