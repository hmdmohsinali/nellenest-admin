import apiService from './api.service.js';
import API_CONFIG from '../config/api.config.js';

// Analytics API Service
export const analyticsAPI = {
  // Get user statistics
  getUserStats: async (params = {}) => {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.USER_STATS, params);
  },

  // Get course statistics
  getCourseStats: async (params = {}) => {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.COURSE_STATS, params);
  },

  // Get performance metrics
  getPerformance: async (params = {}) => {
    return apiService.get(API_CONFIG.ENDPOINTS.ANALYTICS.PERFORMANCE, params);
  }
};

export default analyticsAPI;
