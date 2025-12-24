import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { exchangeGoogleCode } from '../services/authAPI'; 
import { loginSuccess, setAuthError } from '../slices/authSlice'; 
import { path as appPaths } from '../../../shared/utils/routes';
import { setAuthToken } from '../services/authAPI'; // Hàm này dùng để set token cho axios và localStorage

/**
 * Component xử lý callback từ Google OAuth2
 * Nhận code từ URL callback, gửi lên server để đổi lấy JWT token
 */
const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Phân tích tham số từ URL
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const googleError = searchParams.get('error');

    // Xử lý trường hợp Google trả về lỗi
    if (googleError) {
      const errorMessage = `Lỗi từ Google: ${googleError}`;
      console.error(errorMessage);
      dispatch(setAuthError(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
      navigate(appPaths.AUTH.LOGIN, { state: { message: errorMessage, type: 'error' } });
      return;
    }

    // Xử lý trường hợp có authorization code
    if (code) {
      console.log('Google OAuth code nhận được:', code);
      exchangeGoogleCode(code)
        .then(data => {
          console.log('Dữ liệu nhận được từ exchangeGoogleCode:', data);
          // data thường chứa { user, token }
          if (data && data.user && data.token) {
            dispatch(loginSuccess({ user: data.user, token: data.token }));
            setAuthToken(data.token); // Cập nhật token cho các request sau này
            navigate(appPaths.PROTECTED.DASHBOARD); 
          } else {
            throw new Error('Dữ liệu trả về từ server không hợp lệ sau khi đổi Google code.');
          }
        })
        .catch(err => {
          console.error('Lỗi khi xử lý Google callback:', err);
          const errorMessage = err.response?.data?.message || err.message || 'Lỗi xử lý đăng nhập Google. Vui lòng thử lại.';
          dispatch(setAuthError(errorMessage));
          setError(errorMessage);
          navigate(appPaths.AUTH.LOGIN, { state: { message: errorMessage, type: 'error' } });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Không có code trong URL
      const errorMessage = 'Không tìm thấy mã xác thực từ Google trong URL callback.';
      console.error(errorMessage);
      dispatch(setAuthError(errorMessage));
      setError(errorMessage);
      setIsLoading(false);
      navigate(appPaths.AUTH.LOGIN, { state: { message: errorMessage, type: 'error' } });
    }
  }, [location, navigate, dispatch]);

  // Màn hình loading khi đang xử lý
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-[#EA4335] border-b-[#34A853] border-r-[#4285F4] border-l-[#FBBC05] rounded-full animate-spin"></div>
          <p className="text-white text-lg">Đang xử lý đăng nhập với Google...</p>
        </div>
      </div>
    );
  }

  // Không cần hiển thị gì nếu đã navigate hoặc đang loading
  // Error sẽ được hiển thị trên trang login thông qua navigate state
  return null;
};

export default GoogleCallback; 