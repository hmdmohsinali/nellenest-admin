# Nellenest Admin Dashboard

A modern, responsive admin dashboard built with React and Tailwind CSS. This dashboard provides a clean, professional interface for managing your business operations with a focus on user experience, scalability, and **complete authentication system**.

## 🚀 Features

- **🔐 Complete Authentication System**: Login/logout with JWT token management
- **🛡️ Route Protection**: Protected routes that require authentication
- **🔑 Token Management**: Automatic token validation and refresh
- **👤 User Management**: Secure user sessions and profile management
- **🔒 Secure API Calls**: All API requests include authentication headers
- **📱 Modern UI/UX**: Clean, relaxing design with smooth animations and transitions
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **4 Main Sections**: Dashboard, Users, Analytics, and Settings
- **🏗️ Component-Based Architecture**: Easy to maintain and expand
- **📊 Real-time Ready**: Structured for easy integration with real data APIs
- **🔍 Search & Filtering**: Built-in search and filtering capabilities
- **🔔 Notification System**: User-friendly notification management
- **🚪 Logout Functionality**: Secure logout with proper state management

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Main navigation sidebar
│   ├── Header.jsx           # Top navigation header with user dropdown
│   ├── DashboardContent.jsx # Dashboard overview and metrics
│   ├── UsersContent.jsx     # User management interface
│   ├── AnalyticsContent.jsx # Analytics and reporting
│   ├── SettingsContent.jsx  # User preferences and system settings
│   ├── LoginPage.jsx        # Authentication login form
│   ├── ProtectedRoute.jsx   # Route protection component
│   ├── DashboardLayout.jsx  # Main dashboard layout
│   └── LoadingSpinner.jsx   # Loading states component
├── contexts/
│   └── AuthContext.jsx      # Authentication state management
├── utils/
│   └── api.js               # API utilities with auth headers
├── App.jsx                  # Main application with auth provider
├── index.css               # Global styles and Tailwind CSS
└── main.jsx                # Application entry point
```

## 🔐 Authentication System

### **Login Flow**
1. **Login Page**: Professional login form with email/password
2. **Token Storage**: JWT tokens stored securely in localStorage
3. **Route Protection**: All dashboard routes require authentication
4. **Auto-logout**: Automatic logout on token expiration

### **Security Features**
- **JWT Token Validation**: Secure token verification
- **Protected Routes**: Unauthorized users redirected to login
- **Automatic Logout**: Session management with token expiry
- **Secure API Calls**: All requests include authentication headers

### **Demo Credentials**
- **Email**: `admin@nellenest.com`
- **Password**: `admin123`

## 🎯 Component Overview

### Authentication Components
- **`LoginPage.jsx`**: Professional login form with validation
- **`ProtectedRoute.jsx`**: Route protection wrapper
- **`AuthContext.jsx`**: Global authentication state management

### Dashboard Components
- **`Sidebar.jsx`**: Navigation with active states and logout
- **`Header.jsx`**: Top bar with search, notifications, and user profile
- **`DashboardContent.jsx`**: Overview metrics and activity feed
- **`UsersContent.jsx`**: User management with table and actions
- **`AnalyticsContent.jsx`**: Charts and performance data
- **`SettingsContent.jsx`**: Comprehensive settings panel

## 🛠️ Technology Stack

- **React 19**: Latest React with modern hooks and features
- **Context API**: Global state management for authentication
- **JWT Tokens**: Secure authentication and authorization
- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development
- **Heroicons**: Beautiful, consistent icon set
- **Vite**: Fast build tool and development server
- **ESLint**: Code quality and consistency

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd nellenest-admin
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

6. **Login with demo credentials**:
   - Email: `admin@nellenest.com`
   - Password: `admin123`

## 🔐 Authentication Setup

### **Environment Variables**
Create a `.env` file based on `env.example`:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Application Configuration
VITE_APP_NAME=Nellenest Admin
VITE_APP_VERSION=1.0.0
```

### **Backend Integration**
The dashboard is ready to integrate with your backend:

1. **Update API endpoints** in `src/utils/api.js`
2. **Replace mock authentication** in `src/contexts/AuthContext.jsx`
3. **Update API calls** in components to use real endpoints

### **JWT Token Structure**
```javascript
// Expected token structure
{
  "sub": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516325422
}
```

## 📊 Data Structure

The dashboard is designed with a clear data structure that makes it easy to integrate with real APIs:

### User Data Structure
```javascript
{
  id: number,
  name: string,
  email: string,
  role: 'Admin' | 'Moderator' | 'User',
  status: 'Active' | 'Inactive' | 'Suspended',
  lastLogin: string
}
```

### Authentication Data Structure
```javascript
{
  token: string,        // JWT token
  user: {
    id: number,
    name: string,
    email: string,
    role: string,
    avatar?: string
  }
}
```

### API Response Structure
```javascript
{
  success: boolean,
  data?: any,
  message?: string,
  error?: string
}
```

## 🔧 Customization

### Adding New Protected Routes
1. Create a new component in the `components/` directory
2. Add the new section to the sidebar navigation in `Sidebar.jsx`
3. Update the `renderContent()` function in `DashboardLayout.jsx`
4. The route will automatically be protected by authentication

### Authentication Customization
- **Token Storage**: Modify `AuthContext.jsx` for different storage methods
- **API Integration**: Update `src/utils/api.js` for your backend endpoints
- **Validation**: Customize token validation logic in `AuthContext.jsx`

### Styling Customization
- Modify `src/index.css` for global styles
- Use Tailwind CSS utility classes for component-specific styling
- Custom CSS variables for consistent theming

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Desktop**: Full sidebar and header layout
- **Tablet**: Collapsible sidebar with touch-friendly controls
- **Mobile**: Stacked layout with mobile-optimized navigation

## 🔒 Security Considerations

- **JWT Token Security**: Secure token storage and validation
- **Route Protection**: All sensitive routes require authentication
- **API Security**: All API calls include authentication headers
- **Input Validation**: Form validation and sanitization
- **HTTPS**: Use HTTPS in production
- **Rate Limiting**: Implement rate limiting for API calls
- **Audit Logging**: Log authentication events and sensitive operations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables
Ensure your production environment variables are set:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Nellenest Admin
```

## 🔄 API Integration

### **Authentication Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### **User Management Endpoints**
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### **Analytics Endpoints**
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/users` - User analytics
- `GET /api/analytics/content` - Content performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **🔐 Two-Factor Authentication**: Enhanced security with 2FA
- **🌙 Dark Mode**: Complete dark theme implementation
- **📱 Real-time Updates**: WebSocket integration for live data
- **📊 Advanced Charts**: Integration with Chart.js or D3.js
- **📤 Export Functionality**: PDF and Excel export capabilities
- **🌍 Multi-language Support**: Internationalization (i18n)
- **🔍 Advanced Search**: Full-text search with filters
- **📝 Audit Trail**: Comprehensive activity logging
- **📚 API Documentation**: Interactive API documentation
- **📈 Performance Monitoring**: Built-in performance metrics
- **♿ Accessibility**: WCAG 2.1 AA compliance
- **🔐 Role-Based Access Control**: Granular permissions system

---

Built with ❤️ using React, Tailwind CSS, and JWT Authentication
