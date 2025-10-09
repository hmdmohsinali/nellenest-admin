import apiService from './api.service.js';
import API_CONFIG from '../config/api.config.js';

// Admin API Service
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD);
  },

  // User Management
  users: {
    // Get all users with pagination and filtering
    getAll: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.USERS.LIST, params);
    },

    // Get specific user by ID
    getById: async (id) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.USERS.DETAIL(id));
    },

    // Update user
    update: async (id, userData) => {
      return apiService.put(API_CONFIG.ENDPOINTS.ADMIN.USERS.UPDATE(id), userData);
    },

    // Delete user
    delete: async (id) => {
      return apiService.delete(API_CONFIG.ENDPOINTS.ADMIN.USERS.DELETE(id));
    },

    // Bulk update users
    bulkUpdate: async (userIds, updates) => {
      return apiService.put(API_CONFIG.ENDPOINTS.ADMIN.USERS.BULK_UPDATE, {
        userIds,
        updates
      });
    },

    // Bulk delete users
    bulkDelete: async (userIds) => {
      return apiService.delete(API_CONFIG.ENDPOINTS.ADMIN.USERS.BULK_DELETE, {
        userIds
      });
    }
  },

  // theme Management
  themes: {
    // Get all themes
    getAll: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.THEMES.LIST, params);
    },

    // Get specific theme by ID
    getById: async (id) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.THEMES.DETAIL(id));
    },

    // Create new theme
    create: async (themeData) => {
      return apiService.post(API_CONFIG.ENDPOINTS.ADMIN.THEMES.CREATE, themeData);
    },

    // Update theme
    update: async (id, themeData) => {
      return apiService.put(API_CONFIG.ENDPOINTS.ADMIN.THEMES.UPDATE(id), themeData);
    },

    // Delete theme
    delete: async (id) => {
      return apiService.delete(API_CONFIG.ENDPOINTS.ADMIN.THEMES.DELETE(id));
    }
  }
  ,
  // Sleep Songs Management
  sleepSongs: {
    // Get all sleep songs (admin, with pagination/filter)
    getAll: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.SLEEP_SONGS.LIST, params);
    },

    // Get specific sleep song by ID
    getById: async (id) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.SLEEP_SONGS.DETAIL(id));
    },

    // Create new sleep song
    create: async (data) => {
      return apiService.post(API_CONFIG.ENDPOINTS.ADMIN.SLEEP_SONGS.CREATE, data);
    },

    // Update sleep song
    update: async (id, data) => {
      return apiService.put(API_CONFIG.ENDPOINTS.ADMIN.SLEEP_SONGS.UPDATE(id), data);
    },

    // Delete sleep song
    delete: async (id) => {
      return apiService.delete(API_CONFIG.ENDPOINTS.ADMIN.SLEEP_SONGS.DELETE(id));
    }
  },

  // Music Management
  music: {
    // Get all music (admin, with pagination/filter)
    getAll: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.MUSIC.LIST, params);
    },

    // Get specific music by ID
    getById: async (id) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.MUSIC.DETAIL(id));
    },

    // Create new music
    create: async (data) => {
      return apiService.post(API_CONFIG.ENDPOINTS.ADMIN.MUSIC.CREATE, data);
    },

    // Update music
    update: async (id, data) => {
      return apiService.put(API_CONFIG.ENDPOINTS.ADMIN.MUSIC.UPDATE(id), data);
    },

    // Delete music
    delete: async (id) => {
      return apiService.delete(API_CONFIG.ENDPOINTS.ADMIN.MUSIC.DELETE(id));
    }
  }
};

export default adminAPI;
