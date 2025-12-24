import axios from 'axios';
import { API_URL } from '../../config/constants';

/**
 * Base API service for handling HTTP requests to the backend
 * Used for all database operations through the API layer
 */

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 seconds timeout to handle long AI generation requests
});

// Request interceptor for authentication
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;

    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login?session=expired';
    }

    // Handle server errors
    if (response && response.status >= 500) {
      console.error('Server error:', response.data);
    }

    // Handle rate limiting
    if (response && response.status === 429) {
      console.warn('Rate limit exceeded, please try again later');
    }

    return Promise.reject(error);
  }
);

/**
 * Helper methods for common API operations
 */
const ApiService = {
  /**
   * Perform a GET request
   * @param {string} url - The endpoint URL
   * @param {Object} params - Query parameters
   * @returns {Promise} - Axios promise
   */
  get: (url, params = {}) => {
    return apiClient.get(url, { params });
  },

  /**
   * Perform a POST request
   * @param {string} url - The endpoint URL
   * @param {Object} data - Request body
   * @returns {Promise} - Axios promise
   */
  post: (url, data = {}) => {
    return apiClient.post(url, data);
  },

  /**
   * Perform a PUT request
   * @param {string} url - The endpoint URL
   * @param {Object} data - Request body
   * @returns {Promise} - Axios promise
   */
  put: (url, data = {}) => {
    return apiClient.put(url, data);
  },

  /**
   * Perform a DELETE request
   * @param {string} url - The endpoint URL
   * @param {Object} params - Query parameters
   * @returns {Promise} - Axios promise
   */
  delete: (url, params = {}) => {
    return apiClient.delete(url, { params });
  },

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  /**
   * Clear authentication token
   */
  clearToken: () => {
    localStorage.removeItem('token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default ApiService; 