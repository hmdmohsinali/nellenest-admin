# API Integration Guide

This guide explains how the frontend connects to your backend API system.

## 🏗️ Architecture Overview

The frontend uses a modular API service architecture:

```
src/
├── config/
│   └── api.config.js          # API configuration and endpoints
├── services/
│   ├── api.service.js         # Core API service with HTTP methods
│   ├── auth.service.js        # Authentication API calls
│   ├── admin.service.js       # Admin dashboard API calls
│   ├── user.service.js        # User profile API calls
│   ├── analytics.service.js   # Analytics API calls
│   ├── notifications.service.js # Notifications API calls
│   └── index.js               # Service exports
└── contexts/
    └── AuthContext.jsx        # Authentication state management
```

## 🔧 Configuration

### Base URL Configuration
The API base URL is configured in `src/config/api.config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:4000',
  API_VERSION: 'v1',
  TIMEOUT: 30000,
  // ... other config
};
```

### Environment Variables
You can override the base URL using environment variables:

```bash
# .env
VITE_API_BASE_URL=http://localhost:4000
```

## 🔐 Authentication

### Login Flow
```javascript
import { authAPI } from '../services';

// Login user
const loginUser = async (credentials) => {
  try {
    const response = await authAPI.login({
      email: 'admin@nellenest.com',
      password: 'admin123'
    });
    
    if (response.success) {
      // Token and user data are automatically stored
      console.log('Login successful:', response.data);
    }
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### Token Management
- **Automatic Storage**: Tokens are stored in localStorage
- **Automatic Headers**: All API requests include the auth token
- **Token Refresh**: Automatic token refresh on expiration
- **Auto Logout**: Automatic logout on 401 responses

## 📊 Admin Dashboard API

### Dashboard Statistics
```javascript
import { adminAPI } from '../services';

// Get dashboard stats
const getDashboardStats = async () => {
  try {
    const response = await adminAPI.getDashboardStats();
    if (response.success) {
      console.log('Dashboard data:', response.data);
      // response.data contains:
      // - totalUsers
      // - totalCourses
      // - recentUsers
      // - usersByRole
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
};
```

### User Management
```javascript
// Get all users with pagination and filtering
const getUsers = async () => {
  const params = {
    page: 1,
    limit: 10,
    role: 'user',
    isActive: true,
    search: 'john'
  };
  
  const response = await adminAPI.users.getAll(params);
  // response.data contains paginated user list
};

// Get specific user
const getUser = async (userId) => {
  const response = await adminAPI.users.getById(userId);
  // response.data contains user details
};

// Update user
const updateUser = async (userId, updates) => {
  const userData = {
    role: 'admin',
    isActive: false,
    themes: ['calm', 'focus']
  };
  
  const response = await adminAPI.users.update(userId, userData);
};

// Delete user
const deleteUser = async (userId) => {
  const response = await adminAPI.users.delete(userId);
};

// Bulk operations
const bulkUpdateUsers = async (userIds, updates) => {
  const response = await adminAPI.users.bulkUpdate(userIds, {
    isActive: false
  });
};

const bulkDeleteUsers = async (userIds) => {
  const response = await adminAPI.users.bulkDelete(userIds);
};
```

### Course Management
```javascript
// Get all courses
const getCourses = async () => {
  const response = await adminAPI.courses.getAll();
  // response.data contains course list
};

// Create course
const createCourse = async (courseData) => {
  const response = await adminAPI.courses.create({
    title: 'New Course',
    description: 'Course description',
    isActive: true
  });
};

// Update course
const updateCourse = async (courseId, updates) => {
  const response = await adminAPI.courses.update(courseId, updates);
};

// Delete course
const deleteCourse = async (courseId) => {
  const response = await adminAPI.courses.delete(courseId);
};
```

## 👤 User Profile API

```javascript
import { userAPI } from '../services';

// Get user profile
const getProfile = async () => {
  const response = await userAPI.getProfile();
  // response.data contains user profile
};

// Update profile
const updateProfile = async (profileData) => {
  const response = await userAPI.updateProfile({
    name: 'John Doe',
    email: 'john@example.com'
  });
};

// Change password
const changePassword = async (passwordData) => {
  const response = await userAPI.changePassword({
    currentPassword: 'oldpass',
    newPassword: 'newpass'
  });
};

// Get user themes
const getThemes = async () => {
  const response = await userAPI.getThemes();
  // response.data contains user's selected themes
};
```

## 📈 Analytics API

```javascript
import { analyticsAPI } from '../services';

// Get user statistics
const getUserStats = async () => {
  const response = await analyticsAPI.getUserStats({
    period: '7d',
    groupBy: 'role'
  });
};

// Get course statistics
const getCourseStats = async () => {
  const response = await analyticsAPI.getCourseStats({
    period: '30d'
  });
};

// Get performance metrics
const getPerformance = async () => {
  const response = await analyticsAPI.getPerformance();
};
```

## 🔔 Notifications API

```javascript
import { notificationsAPI } from '../services';

// Get all notifications
const getNotifications = async () => {
  const response = await notificationsAPI.getAll({
    unreadOnly: true,
    limit: 10
  });
};

// Mark notification as read
const markAsRead = async (notificationId) => {
  const response = await notificationsAPI.markAsRead(notificationId);
};

// Mark all notifications as read
const markAllAsRead = async () => {
  const response = await notificationsAPI.markAllAsRead();
};

// Delete notification
const deleteNotification = async (notificationId) => {
  const response = await notificationsAPI.delete(notificationId);
};
```

## 🛠️ Error Handling

### Automatic Error Handling
The API service automatically handles common errors:

- **401 Unauthorized**: Automatic logout and redirect to login
- **403 Forbidden**: Shows access denied message
- **404 Not Found**: Shows resource not found message
- **422 Validation Error**: Shows validation error message
- **500 Server Error**: Shows server error message

### Custom Error Handling
```javascript
try {
  const response = await adminAPI.users.getAll();
  // Handle success
} catch (error) {
  // Handle specific errors
  if (error.message.includes('Network error')) {
    // Handle network issues
  } else if (error.message.includes('Unauthorized')) {
    // Handle auth issues
  } else {
    // Handle other errors
  }
}
```

## 🔄 Response Format

All API responses follow this format:

```javascript
{
  success: true,
  data: {
    // Response data
  },
  message: "Success message",
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    pages: 10
  }
}
```

Error responses:
```javascript
{
  success: false,
  message: "Error message",
  error: "Detailed error information"
}
```

## 🚀 Usage Examples

### Complete User Management Example
```javascript
import { adminAPI } from '../services';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.users.getAll({
        page: 1,
        limit: 20,
        role: 'user'
      });
      
      if (response.success) {
        setUsers(response.data.users);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await adminAPI.users.update(userId, {
        role: newRole
      });
      
      if (response.success) {
        // Refresh user list
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Render component...
};
```

### Real-time Data Updates
```javascript
const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Render component...
};
```

## 🔧 Customization

### Adding New API Endpoints
1. Add endpoint to `src/config/api.config.js`
2. Create service method in appropriate service file
3. Export from `src/services/index.js`

### Custom API Service
```javascript
// src/services/custom.service.js
import apiService from './api.service.js';
import API_CONFIG from '../config/api.config.js';

export const customAPI = {
  customEndpoint: async (data) => {
    return apiService.post('/custom/endpoint', data);
  }
};
```

## 🧪 Testing

### Mock API for Development
You can create mock responses for development:

```javascript
// src/services/__mocks__/admin.service.js
export const adminAPI = {
  getDashboardStats: async () => ({
    success: true,
    data: {
      totalUsers: 2847,
      totalCourses: 156,
      recentUsers: [...],
      usersByRole: {...}
    }
  })
};
```

## 📝 Best Practices

1. **Always handle errors**: Use try-catch blocks
2. **Show loading states**: Use loading indicators
3. **Validate responses**: Check `response.success`
4. **Use proper error messages**: Display user-friendly errors
5. **Implement retry logic**: For network failures
6. **Cache responses**: For frequently accessed data
7. **Optimistic updates**: For better UX

## 🔗 Backend Integration

This frontend is designed to work with your backend API endpoints:

- **Base URL**: `http://localhost:4000`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json`
- **Response Format**: Standardized success/error format

Make sure your backend implements all the endpoints defined in `api.config.js` and returns responses in the expected format.
