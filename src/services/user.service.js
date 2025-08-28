import apiService from './api.service.js';
import API_CONFIG from '../config/api.config.js';

// User Profile API Service
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiService.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiService.put(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, profileData);
  },

  // Change user password
  changePassword: async (passwordData) => {
    return apiService.put(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
  },

  // Get user themes
  getThemes: async () => {
    return apiService.get(API_CONFIG.ENDPOINTS.USER.THEMES);
  }
};

export default userAPI;
