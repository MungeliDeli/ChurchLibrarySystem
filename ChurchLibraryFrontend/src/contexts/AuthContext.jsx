import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectLastLogin,
  refreshUser,
  clearError,
} from "../store";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Redux selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const lastLogin = useSelector(selectLastLogin);

  // Local state for additional auth features
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have stored tokens
        const storedToken = authService.getCurrentToken();
        const storedUser = authService.getCurrentUser();

        if (storedToken && storedUser) {
          // Try to refresh the user data to ensure token is valid
          await dispatch(refreshUser()).unwrap();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Clear any invalid data
        authService.clearAuthData();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Set up session timeout
  useEffect(() => {
    if (isAuthenticated && token) {
      // Set up session timeout (e.g., 24 hours)
      const timeout = setTimeout(() => {
        // Session expired, logout user
        authService.clearAuthData();
        window.location.href = "/login";
      }, 24 * 60 * 60 * 1000); // 24 hours

      setSessionTimeout(timeout);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [isAuthenticated, token]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [error, dispatch]);


  // Extend session (reset timeout)
  const extendSession = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    // Set new timeout
    const newTimeout = setTimeout(() => {
      authService.clearAuthData();
      window.location.href = "/login";
    }, 24 * 60 * 60 * 1000);

    setSessionTimeout(newTimeout);
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email;
    return "User";
  };

  // Get user's avatar/initials
  const getUserAvatar = () => {
    if (user?.avatar) return user.avatar;

    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const value = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    lastLogin,
    isInitialized,

    // Methods
    extendSession,
    getUserDisplayName,
    getUserAvatar,

    // Service methods
    authService,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
