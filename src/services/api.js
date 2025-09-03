/**
 * API Service
 * 
 * Base API service with common functionality for all API integrations.
 */
import axios from 'axios';

// Create a base axios instance with common configuration
const api = axios.create({
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    // Get token from local storage or context
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        console.error('Unauthorized access. Please log in again.');
        // Clear local storage or trigger auth refresh
      } else if (status === 403) {
        console.error('Forbidden access. You do not have permission to access this resource.');
      } else if (status === 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server. Please check your connection.');
    } else {
      // Error in setting up the request
      console.error('Error setting up the request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common API operations
const apiService = {
  /**
   * Make a GET request
   * @param {string} url - The URL to request
   * @param {Object} params - Query parameters
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The axios promise
   */
  get: (url, params = {}, config = {}) => {
    return api.get(url, { ...config, params });
  },
  
  /**
   * Make a POST request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The axios promise
   */
  post: (url, data = {}, config = {}) => {
    return api.post(url, data, config);
  },
  
  /**
   * Make a PUT request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The axios promise
   */
  put: (url, data = {}, config = {}) => {
    return api.put(url, data, config);
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - The URL to request
   * @param {Object} config - Additional axios config
   * @returns {Promise} - The axios promise
   */
  delete: (url, config = {}) => {
    return api.delete(url, config);
  },
  
  /**
   * Set the auth token for API requests
   * @param {string} token - The auth token
   */
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common.Authorization;
    }
  },
};

export default apiService;

