import api from './api';

/**
 * Admin Service
 * Handles admin-specific API calls
 */

const adminService = {
  /**
   * Get all users' shopping carts (Admin only)
   * @returns {Promise<Object>} - Aggregated cart data for all users
   */
  async getAllUserCarts() {
    try {
      const response = await api.get('/admin/carts');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch user carts'
      };
    }
  },

  /**
   * Get list of all registered users (Admin only)
   * @returns {Promise<Object>} - List of all users
   */
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch users'
      };
    }
  }
};

export default adminService;
