import API_CONFIG, { buildApiUrl } from '../config/api.config.js';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.maxRetries = API_CONFIG.MAX_RETRIES;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Create headers with authentication
  createHeaders(additionalHeaders = {}) {
    const token = this.getAuthToken();
    return {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...additionalHeaders
    };
  }

  // Handle API response
  async handleResponse(response, skipAuthRedirect = false) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Token expired or invalid
          if (!skipAuthRedirect) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
          }
          // Don't clear localStorage if we're skipping auth redirect
          throw new Error(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED);
        
        case 403:
          throw new Error(API_CONFIG.ERROR_MESSAGES.FORBIDDEN);
        
        case 404:
          throw new Error(API_CONFIG.ERROR_MESSAGES.NOT_FOUND);
        
        case 422:
          throw new Error(errorData.message || API_CONFIG.ERROR_MESSAGES.VALIDATION_ERROR);
        
        case 500:
          throw new Error(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR);
        
        default:
          throw new Error(errorData.message || API_CONFIG.ERROR_MESSAGES.DEFAULT);
      }
    }

    // Handle empty responses
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Make API request with retry logic
  async makeRequest(endpoint, options = {}, retryCount = 0, skipAuthRedirect = false) {
    const url = buildApiUrl(endpoint);
    const config = {
      headers: this.createHeaders(options.headers),
      timeout: this.timeout,
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return await this.handleResponse(response, skipAuthRedirect);
      
    } catch (error) {
      // Handle network errors and retry
      if (error.name === 'AbortError') {
        throw new Error(API_CONFIG.ERROR_MESSAGES.TIMEOUT_ERROR);
      }
      
      if (error.name === 'TypeError' && retryCount < this.maxRetries) {
        // Network error, retry
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.makeRequest(endpoint, options, retryCount + 1, skipAuthRedirect);
      }
      
      throw error;
    }
  }

  // Generic HTTP methods
  async get(endpoint, params = {}, skipAuthRedirect = false) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.makeRequest(url, { method: 'GET' }, 0, skipAuthRedirect);
  }

  async post(endpoint, data = {}, skipAuthRedirect = false) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    }, 0, skipAuthRedirect);
  }

  async put(endpoint, data = {}, skipAuthRedirect = false) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, 0, skipAuthRedirect);
  }

  async patch(endpoint, data = {}, skipAuthRedirect = false) {
    return this.makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }, 0, skipAuthRedirect);
  }

  async delete(endpoint, skipAuthRedirect = false) {
    return this.makeRequest(endpoint, { method: 'DELETE' }, 0, skipAuthRedirect);
  }
}

// Create API service instance
const apiService = new ApiService();

export default apiService;
