import apiService from './api.service.js';
import API_CONFIG from '../config/api.config.js';

// Notifications API Service
export const notificationsAPI = {
  // Get all notifications
  getAll: async (params = {}) => {
    return apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST, params);
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return apiService.put(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiService.put(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  // Delete notification
  delete: async (id) => {
    return apiService.delete(API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE(id));
  }
};

export default notificationsAPI;


