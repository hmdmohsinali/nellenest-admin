// API utility functions for authenticated requests

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Create headers with authentication
const createAuthHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...additionalHeaders
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createAuthHeaders(options.headers),
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API methods
export const api = {
  // GET request
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  
  // POST request
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // PUT request
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // DELETE request
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  
  // PATCH request
  patch: (endpoint, data) => apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  })
};

// Authentication API calls
export const authAPI = {
  // Login
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  // Logout
  logout: async () => {
    return api.post('/auth/logout');
  },
  
  // Refresh token
  refreshToken: async () => {
    return api.post('/auth/refresh');
  },
  
  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    return api.put('/auth/profile', userData);
  },
  
  // Change password
  changePassword: async (passwordData) => {
    return api.put('/auth/password', passwordData);
  }
};

// Users API calls
export const usersAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return api.get(endpoint);
  },
  
  // Get user by ID
  getUser: async (id) => {
    return api.get(`/users/${id}`);
  },
  
  // Create user
  createUser: async (userData) => {
    return api.post('/users', userData);
  },
  
  // Update user
  updateUser: async (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  
  // Delete user
  deleteUser: async (id) => {
    return api.delete(`/users/${id}`);
  },
  
  // Update user status
  updateUserStatus: async (id, status) => {
    return api.patch(`/users/${id}/status`, { status });
  }
};

// Analytics API calls
export const analyticsAPI = {
  // Get dashboard metrics
  getDashboardMetrics: async (period = '7d') => {
    return api.get(`/analytics/dashboard?period=${period}`);
  },
  
  // Get user analytics
  getUserAnalytics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/analytics/users?${queryString}` : '/analytics/users';
    return api.get(endpoint);
  },
  
  // Get content performance
  getContentPerformance: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/analytics/content?${queryString}` : '/analytics/content';
    return api.get(endpoint);
  }
};

// Settings API calls
export const settingsAPI = {
  // Get user settings
  getUserSettings: async () => {
    return api.get('/settings/user');
  },
  
  // Update user settings
  updateUserSettings: async (settings) => {
    return api.put('/settings/user', settings);
  },
  
  // Get system settings
  getSystemSettings: async () => {
    return api.get('/settings/system');
  },
  
  // Update system settings
  updateSystemSettings: async (settings) => {
    return api.put('/settings/system', settings);
  }
};

export default api;
