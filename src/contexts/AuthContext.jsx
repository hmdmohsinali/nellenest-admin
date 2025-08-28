import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services';

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
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');

      console.log('=== AUTH CHECK START ===');
      console.log('storedToken exists:', !!storedToken);
      console.log('storedUser exists:', !!storedUser);
      console.log('storedToken value:', storedToken ? storedToken.substring(0, 20) + '...' : 'null');

      if (storedToken) {
        // Set token first
        setToken(storedToken);
        console.log('Setting token and attempting to validate...');
        
        // Try to validate token and get user data
        try {
          console.log('Calling getCurrentUser API...');
          const userData = await authAPI.getCurrentUser();
          console.log('getCurrentUser response:', userData);
          
          if (userData && userData.success) {
            console.log('Token validation successful, user authenticated');
            setUser(userData.data);
            setIsAuthenticated(true);
            // Update stored user data
            localStorage.setItem('userData', JSON.stringify(userData.data));
          } else if (storedUser) {
            // Fallback to stored user data if API call fails
            console.log('API call failed, using stored user data as fallback');
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // We have a token but no user data - still consider authenticated
            console.log('Token exists but no user data, keeping authenticated');
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.warn('Error validating token:', error);
          console.log('Error details:', error.message);
          
          if (storedUser) {
            // Fallback to stored user data
            console.log('Using stored user data as fallback');
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // If we have a token but no user data and validation fails,
            // still consider authenticated (token might be valid but API issue)
            console.log('Token validation failed but keeping user authenticated with stored token');
            setIsAuthenticated(true);
          }
        }
      } else {
        // No token found, ensure we're logged out
        console.log('No stored token found, user not authenticated');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
      
      console.log('=== AUTH CHECK END ===');
      console.log('Final state - isAuthenticated:', isAuthenticated);
      console.log('Final state - user:', !!user);
      console.log('Final state - token:', !!token);
      
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Don't automatically logout on error, just set as not authenticated
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authAPI.login(credentials);
      
      // Handle the actual backend response format: { "token": "..." }
      if (response && response.token) {
        const token = response.token;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Update token state
        setToken(token);
        
        // Fetch user data using the token
        try {
          const userResponse = await authAPI.getCurrentUser();
          if (userResponse && userResponse.success) {
            const userData = userResponse.data;
            
            // Store user data in localStorage
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update user state
            setUser(userData);
            setIsAuthenticated(true);
            
            return { success: true };
          } else {
            // If we can't get user data, still consider login successful with just token
            setIsAuthenticated(true);
            return { success: true };
          }
        } catch (userError) {
          console.warn('Could not fetch user data:', userError);
          // Still consider login successful with just token
          setIsAuthenticated(true);
          return { success: true };
        }
      } else {
        throw new Error(response?.message || 'Login failed - no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if user is authenticated
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Clear state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      
      if (response && response.success) {
        const { token: newToken } = response.data;
        
        // Update token in localStorage and state
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        
        return newToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    refreshToken,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
