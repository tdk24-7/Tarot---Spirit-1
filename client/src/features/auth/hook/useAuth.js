import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  fetchCurrentUser,
  clearError,
  requestPasswordReset,
  resetUserPassword
} from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Login handler
  const login = useCallback(async (email, password) => {
    try {
      const resultAction = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login result:', resultAction);
      
      // Kiểm tra xem người dùng có phải là admin không
      if (resultAction.user && (resultAction.user.isAdmin || resultAction.user.role === 'admin')) {
        console.log('Admin user detected, redirecting to admin dashboard');
        // Nếu là admin, chuyển đến trang admin dashboard
        navigate('/admin/dashboard');
      } else {
        console.log('Regular user detected, redirecting to normal dashboard');
        // Nếu không phải admin, chuyển đến dashboard thông thường
        navigate('/dashboard');
      }
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }, [dispatch, navigate]);

  // Register handler
  const register = useCallback(async (userData) => {
    try {
      console.log('Register: Dispatching registerUser with data:', userData);
      const resultAction = await dispatch(registerUser(userData)).unwrap();
      console.log('Register: Success result:', resultAction);
      
      if (resultAction) {
        // Hiển thị thông báo thành công nếu cần
        console.log('Đăng ký thành công!');
        return true;
      } else {
        console.error('Register: Empty result but no error thrown');
        return false;
      }
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  }, [dispatch]);

  // Logout handler
  const logout = useCallback(() => {
    dispatch(logoutUser());
    navigate('/');
  }, [dispatch, navigate]);

  // Check auth status
  const checkAuthStatus = useCallback(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  // Forgot password handler
  const requestPassReset = useCallback(async (email) => {
    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      return true;
    } catch (err) {
      return false;
    }
  }, [dispatch]);

  // Reset password handler
  const resetPassword = useCallback(async (token, password) => {
    try {
      await dispatch(resetUserPassword({ token, password })).unwrap();
      return true;
    } catch (err) {
      return false;
    }
  }, [dispatch]);

  // Clear errors
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    requestPasswordReset: requestPassReset,
    resetPassword,
    clearAuthError
  };
};

export default useAuth; 