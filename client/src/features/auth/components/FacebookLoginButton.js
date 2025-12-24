import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { socialLoginUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

// Hằng số cho app ID Facebook (có thể di chuyển vào file config sau này)
const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID || ''; // Thay bằng App ID thật của bạn trong .env

const FacebookLoginButton = memo(({ onLoginSuccess, buttonClassName, iconOnly = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFacebookLogin = async (response) => {
    console.log('Facebook login success, complete response:', response);
    
    if (response.accessToken) {
      try {
        // Tạo đối tượng user
        const user = {
          id: response.userID || response.id, // Thêm userID nếu id không có
          name: response.name,
          email: response.email,
          avatar: response.picture?.data?.url
        };

        console.log('Sending to server with user data:', user);

        // Gọi API để xác thực với backend và nhận JWT token
        const resultAction = await dispatch(socialLoginUser({
          provider: 'facebook',
          authResult: {
            user,
            token: response.accessToken
          }
        })).unwrap();
        
        console.log('Social login response:', resultAction);
        
        // Thông báo thành công cho component cha và truyền thông tin user
        if (onLoginSuccess) {
          onLoginSuccess(resultAction);
        } else {
          // Xử lý chuyển hướng dựa vào quyền admin
          if (resultAction.user && resultAction.user.isAdmin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error during Facebook authentication:', error);
        
        // Hiển thị thông báo lỗi
        const errorMessage = typeof error === 'string' 
          ? error 
          : (error?.message || 'Đăng nhập Facebook thất bại. Vui lòng thử lại sau.');
          
        // Hiển thị thông báo lỗi (có thể sử dụng toast hoặc alert)
        alert(errorMessage);
      }
    } else {
      console.error('No access token provided from Facebook');
      alert('Không nhận được token từ Facebook. Vui lòng thử lại.');
    }
  };

  const facebookIcon = (
    <svg 
      className="w-5 h-5 mr-2 text-[#1877F2]" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  return (
    <FacebookLogin
      appId={FACEBOOK_APP_ID}
      onSuccess={handleFacebookLogin}
      onFail={(error) => {
        console.error("Facebook login failed:", error);
        alert("Đăng nhập Facebook thất bại: " + (error.message || "Lỗi không xác định"));
      }}
      onProfileSuccess={(response) => {
        console.log("Profile Success:", response);
      }}
      initParams={{
        version: 'v18.0',
        cookie: true,
        localStorage: true,
        xfbml: false
      }}
      loginOptions={{
        scope: 'public_profile,email',
        return_scopes: true,
        auth_type: 'rerequest'
      }}
      fields="id,name,email,picture"
      style={
        buttonClassName 
          ? undefined 
          : {
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              cursor: 'pointer',
              height: '100%',
            }
      }
      className={buttonClassName}
      render={({ onClick, logout }) => (
        <button
          onClick={onClick}
          className="flex justify-center items-center py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white hover:border-[#9370db]/30 hover:shadow-lg hover:shadow-[#9370db]/5 transition-all hover:-translate-y-0.5 relative overflow-hidden group w-full"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#9370db]/5 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          <span className="relative z-10 flex items-center tracking-vn-tight">
            {facebookIcon}
            {!iconOnly && 'Facebook'}
          </span>
        </button>
      )}
    />
  );
});

export default FacebookLoginButton; 