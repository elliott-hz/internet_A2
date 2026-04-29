import api from './api';

/**
 * Authentication Service
 * Handles user registration, authentication and token management
 */
export const authService = {
  /**
   * Register a new user
   * @param {string} username - Username
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<Object>} - Registration result
   */
  async register(username, email, password) {
    try {
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      
      return { success: true, user: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  },

  /**
   * Login user and store token
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} - User data and token
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', access_token);
      
      return { success: true, user, token: access_token };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  },

  /**
   * Logout user and clear token
   */
  async logout() {
    try {
      // Call backend logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear token locally
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('user-logged-out'));
    }
  },

  /**
   * Get current auth token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('auth_token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return { success: true, user: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to get user info' 
      };
    }
  }
};

export default authService;
