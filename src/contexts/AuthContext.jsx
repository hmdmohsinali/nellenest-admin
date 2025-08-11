import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');

      if (storedToken && storedUser) {
        // In a real app, you would validate the token with your backend
        const userData = JSON.parse(storedUser);
        
        // For demo purposes, we'll just check if the token exists
        // In production, you should verify the token's validity
        if (isValidToken(storedToken)) {
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear everything
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Simple token validation (replace with real JWT validation)
  const isValidToken = (token) => {
    if (!token) return false;
    
    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // In production, you should verify the token signature and expiration
      // For now, we'll just check if it looks like a JWT
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      // In a real app, this would be an API call
      const { token: authToken, user: userData } = credentials;
      
      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const refreshToken = async () => {
    try {
      // In a real app, this would call your refresh token endpoint
      const storedToken = localStorage.getItem('authToken');
      if (storedToken && isValidToken(storedToken)) {
        // For demo purposes, we'll just return the existing token
        // In production, you'd make an API call to refresh the token
        return storedToken;
      } else {
        throw new Error('Invalid or expired token');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  // Check if token needs refresh (simple implementation)
  const shouldRefreshToken = () => {
    if (!token) return false;
    
    try {
      // In production, decode JWT and check expiration
      // For demo, we'll just return false
      return false;
    } catch (error) {
      return true;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    refreshToken,
    shouldRefreshToken,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
