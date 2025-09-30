// API Configuration for Nellenest Admin Panel
export const API_CONFIG = {
  BASE_URL: 'https://nellenest.vercel.app',
  API_VERSION: 'v1',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/users/login',
      LOGOUT: '/users/logout',
      REFRESH: '/users/refresh',
      ME: '/users/me',
      REGISTER: '/users/register',
      FORGOT_PASSWORD: '/users/forgot-password',
      RESET_PASSWORD: '/users/reset-password',
      VERIFY_EMAIL: '/users/verify-email',
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      USERS: {
        LIST: '/admin/users',
        DETAIL: (id) => `/admin/users/${id}`,
        UPDATE: (id) => `/admin/users/${id}`,
        DELETE: (id) => `/admin/users/${id}`,
        BULK_UPDATE: '/admin/users/bulk/update',
        BULK_DELETE: '/admin/users/bulk/delete',
      },
      COURSES: {
        LIST: '/admin/courses',
        DETAIL: (id) => `/admin/courses/${id}`,
        CREATE: '/admin/courses',
        UPDATE: (id) => `/admin/courses/${id}`,
        DELETE: (id) => `/admin/courses/${id}`,
      },
      SLEEP_SONGS: {
        LIST: '/admin/sleep-songs',
        DETAIL: (id) => `/admin/sleep-songs/${id}`,
        CREATE: '/admin/sleep-songs',
        UPDATE: (id) => `/admin/sleep-songs/${id}`,
        DELETE: (id) => `/admin/sleep-songs/${id}`,
      },
      MUSIC: {
        LIST: '/admin/music',
        DETAIL: (id) => `/admin/music/${id}`,
        CREATE: '/admin/music',
        UPDATE: (id) => `/admin/music/${id}`,
        DELETE: (id) => `/admin/music/${id}`,
      },
    },
    USER: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
      THEMES: '/users/themes',
    },
    ANALYTICS: {
      USER_STATS: '/analytics/users',
      COURSE_STATS: '/analytics/courses',
      PERFORMANCE: '/analytics/performance',
    },
    NOTIFICATIONS: {
      LIST: '/notifications',
      MARK_READ: (id) => `/notifications/${id}/read`,
      MARK_ALL_READ: '/notifications/mark-all-read',
      DELETE: (id) => `/notifications/${id}`,
    },
    FILES: {
      UPLOAD: '/files/upload',
      DELETE: (id) => `/files/${id}`,
      LIST: '/files',
    },
  },
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
  },
  ERROR_MESSAGES: {
    DEFAULT: 'An unexpected error occurred',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    FORBIDDEN: 'Access forbidden. You don\'t have permission.',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error. Please check your input.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to build versioned API URL
export const getVersionedUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}${endpoint}`;
};

export default API_CONFIG;
