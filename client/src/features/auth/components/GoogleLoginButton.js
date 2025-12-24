import React, { memo } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';

// Google SVG icon component
const GoogleIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const GoogleLoginButton = memo(({ onLoginSuccess, onFailure, buttonClassName, iconOnly = false }) => {
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google login success:', tokenResponse);
        // Gửi token đến backend để xác thực
        const response = await axios.post('http://localhost:5001/api/auth/social/google', {
          token: tokenResponse.access_token
        });
        
        if (response.data?.status === 'success') {
          onLoginSuccess(response.data.data);
        } else {
          throw new Error('Phản hồi từ server không hợp lệ');
        }
      } catch (err) {
        console.error('Lỗi khi xử lý đăng nhập Google:', err);
        if (onFailure) {
          onFailure(err);
        }
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      if (onFailure) {
        onFailure(error);
      }
    },
    scope: 'email profile',
  });
  
  return (
    <button
      onClick={() => login()}
      className="flex justify-center items-center py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white hover:border-[#EA4335]/30 hover:shadow-lg hover:shadow-[#EA4335]/5 transition-all hover:-translate-y-0.5 relative overflow-hidden group w-full"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[#EA4335]/5 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      <span className="relative z-10 flex items-center tracking-vn-tight">
        <GoogleIcon />
        {!iconOnly && 'Google'}
      </span>
    </button>
  );
});

export default GoogleLoginButton; 