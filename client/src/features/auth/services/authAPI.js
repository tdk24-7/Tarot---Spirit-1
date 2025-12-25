import axios from 'axios';
import { mockLogin, mockRegister, mockGetCurrentUser, mockSocialLogin, USE_MOCK_API } from '../../../shared/utils/api/mockAuthAPI';
import { mockAdminLogin, mockCreateAdminAccount, USE_MOCK_ADMIN_API } from '../../../shared/utils/api/mockAdminAPI';
import { API_URL } from '../../../config/constants';

// Tạo instance axios với baseURL đúng
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Log cấu hình để debug
console.log('authAPI: Sử dụng baseURL:', API_URL);

// Add token to axios headers
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    // Đảm bảo token được áp dụng cho tất cả instance axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Set token khi khởi tạo module
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Login with email and password
export const login = async (email, password) => {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    try {
      const response = await mockLogin(email, password);

      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      // Set auth token in axios headers
      setAuthToken(response.token);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Real API
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });

    // Save user and token to localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);

    // Set auth token in axios headers
    setAuthToken(response.data.token);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi đăng nhập' };
  }
};

// Admin login with email and password
export const adminLogin = async (email, password) => {
  // Use mock API if enabled
  if (USE_MOCK_ADMIN_API) {
    try {
      const response = await mockAdminLogin(email, password);

      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      // Set auth token in axios headers
      setAuthToken(response.token);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Real API for admin login
  try {
    const response = await axiosInstance.post('/auth/admin/login', { email, password });

    // Save user and token to localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);

    // Set auth token in axios headers
    setAuthToken(response.data.token);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi đăng nhập admin' };
  }
};

// Register a new user
export const register = async (userData) => {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    try {
      console.log('Using mock register API with:', userData);
      const mockResponse = await mockRegister(userData);
      console.log('Mock register response:', mockResponse);
      return mockResponse;
    } catch (error) {
      console.error('Mock register error:', error);
      throw error;
    }
  }

  // Real API
  try {
    console.log('Calling real register API with:', userData);
    const response = await axiosInstance.post('/auth/register', userData);
    console.log('Real register API response:', response);

    // Kiểm tra cấu trúc response
    if (response && response.data) {
      // Nếu response có định dạng .data.data (nhiều API có format như vậy)
      if (response.data.data) {
        return response.data;
      }
      // Nếu response có user và token trực tiếp
      if (response.data.user && response.data.token) {
        return {
          data: {
            user: response.data.user,
            token: response.data.token
          }
        };
      }
      // Format response khác
      return response.data;
    } else {
      console.error('Register API unexpected response format:', response);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Register API error:', error);

    // Detailed error logging for debugging
    if (error.response) {
      // Server responded with an error
      console.error('Register server error:', {
        status: error.response.status,
        data: error.response.data
      });

      // Trả về thông báo lỗi từ server nếu có
      if (error.response.data && error.response.data.message) {
        throw { message: error.response.data.message };
      }

      // Xử lý các mã lỗi thường gặp
      if (error.response.status === 409) {
        throw { message: 'Email hoặc tên người dùng đã tồn tại' };
      } else if (error.response.status === 400) {
        throw { message: 'Dữ liệu đăng ký không hợp lệ' };
      }

      throw error.response.data || { message: 'Lỗi đăng ký từ server' };
    } else if (error.request) {
      // Request was made but no response received
      console.error('Register network error - no response received');
      throw { message: 'Không nhận được phản hồi từ server, vui lòng kiểm tra kết nối mạng' };
    } else {
      // Error setting up the request
      console.error('Register setup error:', error.message);
      throw { message: 'Lỗi thiết lập yêu cầu: ' + error.message };
    }
  }
};

// Create an admin account (admin only)
export const createAdminAccount = async (userData) => {
  // Use mock API if enabled
  if (USE_MOCK_ADMIN_API) {
    try {
      return await mockCreateAdminAccount(userData);
    } catch (error) {
      throw error;
    }
  }

  // Real API
  try {
    const response = await axiosInstance.post('/admin/users/create-admin', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi tạo tài khoản admin' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    try {
      return await mockGetCurrentUser();
    } catch (error) {
      throw error;
    }
  }

  // Real API
  try {
    console.log('Calling getCurrentUser API...');
    // Đảm bảo token được áp dụng
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    const response = await axiosInstance.get('/auth/me');
    console.log('getCurrentUser API response:', response);

    if (response && response.data) {
      return response.data;
    } else {
      console.error('Unexpected response format from getCurrentUser API:', response);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Error in getCurrentUser API:', error);
    // Detailed error logging
    if (error.response) {
      console.error('Server error in getCurrentUser:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error.response?.data || { message: 'Lỗi lấy thông tin người dùng' };
  }
};

// Forgot password request
export const forgotPassword = async (email) => {
  try {
    if (USE_MOCK_API) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Email đặt lại mật khẩu đã được gửi' };
    }

    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi gửi yêu cầu đặt lại mật khẩu' };
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    if (USE_MOCK_API) {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Mật khẩu đã được đặt lại thành công' };
    }

    const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi đặt lại mật khẩu' };
  }
};

// Trao đổi Google authorization code lấy token (qua backend của bạn)
export const exchangeGoogleCode = async (code) => {
  try {
    // Endpoint này cần được tạo ở backend của bạn
    // Nó sẽ nhận code, gửi đến Google để lấy token, lấy thông tin user,
    // sau đó tạo/đăng nhập user trong DB của bạn và trả về token session của bạn.
    const response = await axiosInstance.post('/auth/social/google/exchange', { code });

    // Giả sử backend trả về { user, token } giống như các hàm login khác
    if (response.data && response.data.user && response.data.token) {
      return response.data;
    } else {
      // Nếu backend trả về cấu trúc khác, ví dụ trong response.data.data
      if (response.data && response.data.data && response.data.data.user && response.data.data.token) {
        return response.data.data;
      }
      throw new Error('Phản hồi từ server không hợp lệ sau khi trao đổi Google code.');
    }
  } catch (error) {
    console.error('Lỗi trao đổi Google code:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Lỗi khi trao đổi mã xác thực Google với backend.' };
  }
};

// Handle social login
// Hàm này có thể cần điều chỉnh tùy theo luồng của Facebook và Google
// Hiện tại, socialLogin đang được dùng cho Facebook, nơi client gửi token của Facebook lên.
// GoogleCallback sẽ dùng exchangeGoogleCode trực tiếp.
export const socialLogin = async (data) => {
  try {
    const { provider, authResult } = data;

    // Kiểm tra tham số đầu vào
    if (!provider || !authResult) {
      throw new Error('Thiếu thông tin provider hoặc authResult');
    }

    // Hiện tại chỉ hỗ trợ facebook qua endpoint này
    if (provider.toLowerCase() !== 'facebook') {
      throw new Error('Provider không được hỗ trợ cho hàm socialLogin này.');
    }

    const payload = {
      accessToken: authResult.token, // Thay đổi tên tham số phù hợp với API
      userId: authResult.user?.id,   // Thay đổi tên tham số phù hợp với API
      email: authResult.user?.email,
      name: authResult.user?.name
    };

    console.log('Social login request payload:', payload);

    // Sử dụng API facebook/token theo như route.js định nghĩa
    const response = await axiosInstance.post('/auth/facebook/token', payload);

    console.log('Social login API response:', response);

    // Kiểm tra và xử lý nhiều định dạng response có thể có
    if (response.data) {
      // Cấu trúc phổ biến có data.data
      if (response.data.data && response.data.data.token && response.data.data.user) {
        // Set token in axios headers
        setAuthToken(response.data.data.token);
        return response.data;
      }

      // Cấu trúc với token và user trực tiếp trong data
      if (response.data.token && response.data.user) {
        // Set token in axios headers
        setAuthToken(response.data.token);
        return response.data;
      }
    }

    // Nếu không tìm thấy cấu trúc phù hợp
    console.error('Cấu trúc response không đúng định dạng:', response);
    throw new Error('Dữ liệu đăng nhập qua mạng xã hội không hợp lệ.');
  } catch (error) {
    console.error(`Lỗi đăng nhập ${data?.provider}:`, error);
    if (error.response) {
      console.error('Server response error:', error.response.status, error.response.data);
    }
    throw error.response?.data || { message: `Lỗi đăng nhập qua ${data?.provider || 'mạng xã hội'}` };
  }
};

// Logout
export const logout = () => {
  // Remove user from storage
  localStorage.removeItem('user');
  localStorage.removeItem('token');

  // Clear axios auth header
  setAuthToken(null);

  return { success: true };
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    // Ensure token is attached
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    const response = await axiosInstance.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể đổi mật khẩu' };
  }
};
