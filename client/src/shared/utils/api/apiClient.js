import axios from 'axios';
import { enhanceNetworkError } from './errorUtils';

// Import API_URL
import { API_URL } from '../../../config/constants';

// Base config for axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  timeout: 60000, // Increased to 60 seconds to handle long AI generation requests
  withCredentials: true, // Enable sending cookies with requests
});

// Log the API URL being used to make debugging easier
console.log('apiClient initialized with baseURL:', API_URL);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log the URL being used
    const fullUrl = config.baseURL + config.url;
    console.log('API URL being used:', fullUrl);

    // Lấy token auth từ localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('tarotOnlineAuthToken');

    // Add check for USE_MOCK_API before requiring token
    const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true' ||
      process.env.REACT_APP_USE_MOCK_API === 'true';

    // Skip token check when using mock API
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Auth token added to request headers');
    } else if (!useMockApi) {
      // Thêm token giả cho các API yêu cầu xác thực khi đang phát triển
      if (process.env.NODE_ENV === 'development') {
        config.headers.Authorization = 'Bearer test-token-for-development';
        console.log('Development test token added to request headers');
      } else {
        console.warn('No auth token found in localStorage');
      }
    }

    return config;
  },
  (error) => Promise.reject(enhanceNetworkError(error))
);

// Add a retry mechanism for failed requests
const MAX_RETRIES = 2;
apiClient.interceptors.response.use(
  // Handle successful responses
  (response) => {
    // Only log if in development mode
    if (process.env.NODE_ENV === 'development') {
      // Log only basic info about successful responses
      console.log(`API ${response.config.method.toUpperCase()} ${response.config.url}: ${response.status}`);
    }
    return response;
  },
  // Handle error responses with retry logic
  async (error) => {
    const { config } = error;

    // Only retry GET requests that failed due to network issues
    if (config && config.method && config.method.toLowerCase() === 'get' && !error.response) {
      config.retryCount = config.retryCount || 0;

      // Check if we've maxed out the retries
      if (config.retryCount < MAX_RETRIES) {
        // Increment the retry count
        config.retryCount += 1;

        console.log(`Retry attempt ${config.retryCount} for URL: ${config.url}`);

        // Create new promise to handle retry
        const backoff = new Promise((resolve) => {
          setTimeout(() => {
            console.log('Retrying request...');
            resolve();
          }, 1000 * config.retryCount); // Increasing backoff
        });

        await backoff;
        return apiClient(config);
      }
    }

    // Enhance error with more details
    const enhancedError = enhanceNetworkError(error);

    // Check if we are using mock API
    const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true' ||
      process.env.REACT_APP_USE_MOCK_API === 'true';

    // Handle 401 (Unauthorized) errors, but only if not using mock API
    if (error.response && error.response.status === 401 && !useMockApi) {
      console.log('Lỗi xác thực 401 - Token không hợp lệ hoặc hết hạn');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Thông báo cho người dùng trước khi chuyển hướng
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Lỗi kết nối mạng:', error.message);
      return Promise.reject({
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
        originalError: error.message
      });
    }

    // Handle 500 errors
    if (error.response.status >= 500) {
      console.error('Lỗi máy chủ:', error.response.status);
      return Promise.reject({
        message: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.',
        originalError: error.response.data
      });
    }

    // Return the error response data for handling by the components
    return Promise.reject(error.response ? error.response.data : enhancedError);
  }
);

// Debug helper for fetch errors
apiClient.debugFetchError = (error) => {
  console.group('Facebook Login Debug Info');

  if (error.name === 'TypeError' && error.message === 'Network request failed') {
    console.log('This is a common "Network request failed" error which can have many causes:');
    console.log('1. CORS issues - server not allowing cross-origin requests');
    console.log('2. Network connectivity issues');
    console.log('3. Server unreachable or timeout');
    console.log('4. Invalid SSL certificate');

    // Check for more specific details
    if (error.enhancedData) {
      console.log('Enhanced error details:', error.enhancedData);
    }

    console.log('\nTroubleshooting steps:');
    console.log('- Check network connection');
    console.log('- Verify the server is running and accessible');
    console.log('- Verify that you have the correct URL');
    console.log('- Check for CORS headers on server');
    console.log('- Check if you need a valid SSL certificate');
  } else {
    console.log('Error details:', error);
  }

  console.groupEnd();

  return error; // Return the error to allow chaining
};

export default apiClient; 