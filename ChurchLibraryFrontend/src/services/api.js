import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import storageService from "./storageService";
import { handleError } from "../utils/helpers";

// Environment configuration
const isDevelopment = import.meta.env.MODE === "development";
const isProduction = import.meta.env.MODE === "production";

// API Configuration
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: isDevelopment ? 600000 : 10000, // Longer timeout for development
  headers: {
    Accept: "application/json",
  },
  // Enable request/response logging in development
  ...(isDevelopment && {
    validateStatus: (status) => status < 500,
  }),
};

// Create axios instance
const api = axios.create(API_CONFIG);

// Request interceptor to add auth token and logging
api.interceptors.request.use(
  (config) => {
    const token = storageService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Log warning in development if token is missing for protected routes
      if (isDevelopment) {
        console.warn(
          `⚠️ No auth token found for request: ${config.method?.toUpperCase()} ${config.url}`
        );
      }
    }

    // Log requests in development
    if (isDevelopment) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
          hasToken: !!token,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (isDevelopment) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          data: response.data,
        }
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (isDevelopment) {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = storageService.getRefreshToken();
        if (refreshToken) {
          const refreshResponse = await authAPI.refresh(refreshToken);
          const { token: newToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          // Update stored tokens
          storageService.setAuthToken(newToken);
          if (newRefreshToken) {
            storageService.setRefreshToken(newRefreshToken);
          }

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // If refresh fails, clear auth data and redirect to login
        storageService.clearAuthData();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle other HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error(
            "Bad Request:",
            data?.message || "Invalid request data"
          );
          break;
        case 401:
          // Unauthorized - clear token and redirect to login
          storageService.clearAuthData();
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden: Access denied");
          break;
        case 404:
          console.error("Not Found: Resource not found");
          break;
        case 422:
          console.error("Validation Error:", data?.errors || data?.message);
          break;
        case 429:
          console.error("Rate Limited: Too many requests");
          break;
        case 500:
          console.error("Server Error: Internal server error");
          break;
        case 502:
          console.error("Bad Gateway: Server temporarily unavailable");
          break;
        case 503:
          console.error("Service Unavailable: Server maintenance");
          break;
        default:
          console.error(
            `HTTP Error ${status}:`,
            data?.message || "Unknown error"
          );
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error: No response received from server");
    } else {
      // Something else happened
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API methods with enhanced error handling
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Login failed"));
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      storageService.clearAuthData();
      return response;
    } catch (error) {
      // Clear auth data even if logout fails
      storageService.clearAuthData();
      throw new Error(handleError(error, "Logout failed"));
    }
  },

  refresh: async (refreshToken) => {
    try {
      const response = await api.post("/auth/refresh", { refreshToken });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Token refresh failed"));
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to get user profile"));
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to update profile"));
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.post("/auth/change-password", passwordData);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to change password"));
    }
  },
};

export const booksAPI = {
  getBooks: async (params = {}) => {
    try {
      const response = await api.get("/books", { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch books"));
    }
  },

  getBook: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch book"));
    }
  },

  createBook: async (data, onUploadProgress) => {
    try {
      const response = await api.post("/books", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
      });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to create book"));
    }
  },

  updateBook: async (id, data) => {
    try {
      const response = await api.put(`/books/${id}`, data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to update book"));
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to delete book"));
    }
  },

  // Additional book-related endpoints
  searchBooks: async (query, params = {}) => {
    try {
      const response = await api.get("/books/search", {
        params: { q: query, ...params },
      });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to search books"));
    }
  },

  getBookCategories: async () => {
    try {
      const response = await api.get("/books/categories");
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch book categories"));
    }
  },

  importBooks: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/books/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to import books"));
    }
  },

  exportBooks: async (params = {}) => {
    try {
      const response = await api.get("/books/export", {
        params,
        responseType: "blob",
      });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to export books"));
    }
  },
};

export const categoriesAPI = {
  getCategories: async (params = {}) => {
    try {
      const response = await api.get("/categories", { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch categories"));
    }
  },
  createCategory: async (data) => {
    try {
      const response = await api.post("/categories", data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to create category"));
    }
  },
  updateCategory: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to update category"));
    }
  },
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to delete category"));
    }
  },
};

export const usersAPI = {
  getUsers: async (params = {}) => {
    try {
      const response = await api.get("/users", { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch users"));
    }
  },

  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch user"));
    }
  },

  createUser: async (data) => {
    try {
      const response = await api.post("/users", data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to create user"));
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to update user"));
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to delete user"));
    }
  },

  // Additional user-related endpoints
  getUserActivity: async (id, params = {}) => {
    try {
      const response = await api.get(`/users/${id}/activity`, { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch user activity"));
    }
  },

  getUserBorrowings: async (id, params = {}) => {
    try {
      const response = await api.get(`/users/${id}/borrowings`, { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch user borrowings"));
    }
  },

  resetUserPassword: async (id) => {
    try {
      const response = await api.post(`/users/${id}/reset-password`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to reset user password"));
    }
  },
};

export const borrowingsAPI = {
  getBorrowings: async (params = {}) => {
    try {
      const response = await api.get("/borrowings", { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch borrowings"));
    }
  },

  getBorrowing: async (id) => {
    try {
      const response = await api.get(`/borrowings/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch borrowing"));
    }
  },

  createBorrowing: async (data) => {
    try {
      const response = await api.post("/borrowings", data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to create borrowing"));
    }
  },

  updateBorrowing: async (id, data) => {
    try {
      const response = await api.put(`/borrowings/${id}`, data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to update borrowing"));
    }
  },

  returnBook: async (id) => {
    try {
      const response = await api.post(`/borrowings/${id}/return`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to return book"));
    }
  },

  renewBook: async (id) => {
    try {
      const response = await api.post(`/borrowings/${id}/renew`);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to renew book"));
    }
  },
};

export const statisticsAPI = {
  getDashboardStats: async () => {
    try {
      const response = await api.get("/statistics/dashboard");
      return response;
    } catch (error) {
      throw new Error(
        handleError(error, "Failed to fetch dashboard statistics")
      );
    }
  },

  getReports: async (params = {}) => {
    try {
      const response = await api.get("/statistics/reports", { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch reports"));
    }
  },

  // Additional statistics endpoints
  getMonthlyStats: async (year, month) => {
    try {
      const response = await api.get("/statistics/monthly", {
        params: { year, month },
      });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch monthly statistics"));
    }
  },

  getPopularBooks: async (params = {}) => {
    try {
      const response = await api.get("/statistics/popular-books", { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch popular books"));
    }
  },

  getUserStats: async (params = {}) => {
    try {
      const response = await api.get("/statistics/users", { params });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch user statistics"));
    }
  },

  exportReport: async (type, params = {}) => {
    try {
      const response = await api.get(`/statistics/export/${type}`, {
        params,
        responseType: "blob",
      });
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to export report"));
    }
  },
};

export const settingsAPI = {
  getSettings: async () => {
    try {
      const response = await api.get("/settings");
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch settings"));
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put("/settings", data);
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to update settings"));
    }
  },

  getSystemInfo: async () => {
    try {
      const response = await api.get("/settings/system-info");
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch system information"));
    }
  },

  backupDatabase: async () => {
    try {
      const response = await api.post("/settings/backup");
      return response;
    } catch (error) {
      throw new Error(handleError(error, "Failed to create backup"));
    }
  },
};

export const activityLogsAPI = {
  getActivityLogs: async (params = {}) => {
    try {
      const response = await api.get("/activity/logs", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleError(error, "Failed to fetch activity logs"));
    }
  },

  exportActivityLogs: async (params = {}, format = "json") => {
    try {
      const response = await api.get("/activity/export", {
        params: { ...params, format },
        responseType: "blob",
      });
      
      // Create download link
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const extension = format === "csv" ? "csv" : "json";
      link.download = `activity-logs-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      throw new Error(handleError(error, "Failed to export activity logs"));
    }
  },

  archiveActivityLogs: async (data) => {
    try {
      const response = await api.post("/activity/archive", data);
      return response.data;
    } catch (error) {
      throw new Error(handleError(error, "Failed to archive activity logs"));
    }
  },
};

// Utility function to check API health
export const checkAPIHealth = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    console.error("API health check failed:", error);
    return { status: "unhealthy", error: error.message };
  }
};

// Export the configured axios instance
export default api;
