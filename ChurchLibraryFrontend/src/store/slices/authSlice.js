import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";
import storageService from "../../services/storageService";
import DEV_CREDENTIALS, { DEV_USER } from "../../services/devCredentials";
import { isFeatureEnabled } from "../../config/environment";

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLogin: null,
  refreshToken: null, // Add refresh token support
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // Try normal API login first
      const response = await authAPI.login(credentials);
      const { user, token, refreshToken } = response.data;

      // Store tokens in local storage for API interceptors
      storageService.setAuthToken(token);
      if (refreshToken) {
        storageService.setRefreshToken(refreshToken);
      }

      return { user, token, refreshToken };
    } catch (error) {
      // If API login fails and mock mode is enabled, try local dev credentials
      const allowMock = isFeatureEnabled("mockData");
      const matchesDev =
        credentials?.email === DEV_CREDENTIALS.email &&
        credentials?.password === DEV_CREDENTIALS.password;

      if (allowMock && matchesDev) {
        // Issue a temporary token and persist minimal auth data
        const token = "dev-temp-token";
        const refreshToken = "dev-temp-refresh";
        storageService.setAuthToken(token);
        storageService.setRefreshToken(refreshToken);
        storageService.setUserData(DEV_USER);
        return { user: DEV_USER, token, refreshToken };
      }

      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Clear local storage first
      storageService.removeAuthToken();
      storageService.removeRefreshToken();
      storageService.removeUserData();

      // Then call logout API if token exists
      const token = storageService.getAuthToken();
      if (token) {
        await authAPI.logout();
      }
      return null;
    } catch (error) {
      // Even if logout API fails, we still want to clear local state
      console.error("Logout API error:", error);
      return null;
    }
  }
);

export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token, refreshToken } = getState().auth;
      if (!token) {
        throw new Error("No token available");
      }

      // Try to refresh the token first
      if (refreshToken) {
        try {
          const refreshResponse = await authAPI.refresh(refreshToken);
          const { token: newToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          // Update stored tokens
          storageService.setAuthToken(newToken);
          if (newRefreshToken) {
            storageService.setRefreshToken(newRefreshToken);
          }

          // Return new token data
          return { token: newToken, refreshToken: newRefreshToken };
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // If refresh fails, try to get profile with current token
        }
      }

      // Get user profile with current token
      const response = await authAPI.getProfile();
      return { user: response.data, token, refreshToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh user data"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      // This would typically call an API to update the user profile
      // For now, we'll just return the updated data
      return userData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set authentication state from storage (for persistence)
    setAuthFromStorage: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!user && !!token;
    },

    // Clear authentication state
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastLogin = null;
    },

    // Update user data
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Update tokens
    updateTokens: (state, action) => {
      const { token, refreshToken } = action.payload;
      if (token) state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token, refreshToken } = action.payload;
        state.isLoading = false;
        state.user = user;
        state.token = token;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        state.lastLogin = new Date().toISOString();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.lastLogin = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // Even if logout fails, clear the state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Refresh user
      .addCase(refreshUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        if (action.payload.token) {
          state.token = action.payload.token;
        }
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // If refresh fails, clear auth state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

// Export actions
export const {
  clearError,
  setAuthFromStorage,
  clearAuth,
  updateUser,
  setLoading,
  updateTokens,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectLastLogin = (state) => state.auth.lastLogin;

// Export reducer
export default authSlice.reducer;
