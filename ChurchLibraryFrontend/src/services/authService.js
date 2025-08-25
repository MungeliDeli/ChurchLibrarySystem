import { authAPI } from "./api";
import storageService from "./storageService";

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      const { user, token, refreshToken } = response.data;

      // Store tokens
      storageService.setAuthToken(token);
      if (refreshToken) {
        storageService.setRefreshToken(refreshToken);
      }

      return { success: true, user, token, refreshToken };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }

  // Logout user
  async logout() {
    try {
      const token = storageService.getAuthToken();

      // Call logout API if token exists
      if (token) {
        await authAPI.logout();
      }

      // Clear local storage
      storageService.clearAuthData();

      return { success: true };
    } catch (error) {
      // Even if API fails, clear local data
      storageService.clearAuthData();
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = storageService.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authAPI.refresh(refreshToken);
      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      // Update stored tokens
      storageService.setAuthToken(newToken);
      if (newRefreshToken) {
        storageService.setRefreshToken(newRefreshToken);
      }

      return { success: true, token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      // If refresh fails, clear auth data
      storageService.clearAuthData();
      return {
        success: false,
        error: error.response?.data?.message || "Token refresh failed",
      };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await authAPI.getProfile();
      return { success: true, user: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get profile",
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = storageService.getAuthToken();
    const user = storageService.getUserData();
    return !!(token && user);
  }

  // Get current user
  getCurrentUser() {
    return storageService.getUserData();
  }

  // Get current token
  getCurrentToken() {
    return storageService.getAuthToken();
  }

  // Get current refresh token
  getCurrentRefreshToken() {
    return storageService.getRefreshToken();
  }

  // Update user data in storage
  updateUserData(userData) {
    storageService.setUserData(userData);
  }

  // Clear all auth data
  clearAuthData() {
    storageService.clearAuthData();
  }
}

export default new AuthService();
