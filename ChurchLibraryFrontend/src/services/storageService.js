import { STORAGE_KEYS } from "../utils/constants";

class StorageService {
  // Authentication storage
  setAuthToken(token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  removeAuthToken() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  setRefreshToken(token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  removeRefreshToken() {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setUserData(userData) {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  getUserData() {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  removeUserData() {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Clear all auth data
  clearAuthData() {
    this.removeAuthToken();
    this.removeRefreshToken();
    this.removeUserData();
  }

  // Theme storage
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  }

  // Sidebar state storage
  setSidebarState(isOpen) {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(isOpen));
  }

  getSidebarState() {
    const state = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
    return state ? JSON.parse(state) : true;
  }

  // Generic storage methods
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error setting storage item:", error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error getting storage item:", error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing storage item:", error);
      return false;
    }
  }

  // Clear all storage
  clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  }

  // Check if storage is available
  isAvailable() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get storage size (approximate)
  getSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  // Session storage methods (for temporary data)
  setSessionItem(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error setting session item:", error);
      return false;
    }
  }

  getSessionItem(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error getting session item:", error);
      return defaultValue;
    }
  }

  removeSessionItem(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing session item:", error);
      return false;
    }
  }

  clearSession() {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing session storage:", error);
      return false;
    }
  }
}

export default new StorageService();
