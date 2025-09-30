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

  // Course Management
  courses: {
    // Get all courses
    getAll: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.COURSES.LIST, params);
    },

    // Get specific course by ID
    getById: async (id) => {
      return apiService.get(API_CONFIG.ENDPOINTS.ADMIN.COURSES.DETAIL(id));
    },

    // Create new course
    create: async (courseData) => {
      return apiService.post(API_CONFIG.ENDPOINTS.ADMIN.COURSES.CREATE, courseData);
    },

    // Update course
    update: async (id, courseData) => {
      return apiService.put(API_CONFIG.ENDPOINTS.ADMIN.COURSES.UPDATE(id), courseData);
    },

    // Delete course
    delete: async (id) => {
      return apiService.delete(API_CONFIG.ENDPOINTS.ADMIN.COURSES.DELETE(id));
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
  }
};

export default adminAPI;
