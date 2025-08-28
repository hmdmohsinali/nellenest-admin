import apiService from './api.service.js';
import API_CONFIG from '../config/api.config.js';

// Authentication API Service
export const authAPI = {
  // Login user
  login: async (credentials) => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  },

  // Logout user
  logout: async () => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  },

  // Refresh authentication token
  refreshToken: async () => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    return apiService.get(API_CONFIG.ENDPOINTS.AUTH.ME, {}, true); // Skip auth redirect for auth checks
  },

  // Register new user
  register: async (userData) => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
  },

  // Request password reset
  forgotPassword: async (email) => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  },

  // Verify email address
  verifyEmail: async (token) => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }
};

export default authAPI;
