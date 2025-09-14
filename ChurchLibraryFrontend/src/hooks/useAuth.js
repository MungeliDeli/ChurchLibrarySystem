import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  logoutUser,
  refreshUser,
  updateUserProfile,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectLastLogin,
} from "../store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const lastLogin = useSelector(selectLastLogin);

  // Login function
  const login = useCallback(
    async (credentials) => {
      try {
        const result = await dispatch(loginUser(credentials)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [dispatch]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, redirect to login
      navigate("/login");
      return { success: false, error };
    }
  }, [dispatch, navigate]);

  // Refresh user data
  const refresh = useCallback(async () => {
    try {
      const result = await dispatch(refreshUser()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  // Update user profile
  const updateProfile = useCallback(
    async (userData) => {
      try {
        const result = await dispatch(updateUserProfile(userData)).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [dispatch]
  );

  

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    lastLogin,

    // Actions
    login,
    logout,
    refresh,
    updateProfile,

    // Utilities
  };
};
