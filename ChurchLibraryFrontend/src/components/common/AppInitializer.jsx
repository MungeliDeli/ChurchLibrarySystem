import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthFromStorage,
  setThemeFromStorage,
  detectSystemTheme,
  selectIsAuthenticated,
  selectIsDarkMode,
  refreshUser,
} from "../../store";
import storageService from "../../services/storageService";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Apply theme to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Initialize theme from storage
    const storedTheme = storageService.getTheme();
    const storedSidebarState = storageService.getSidebarState();

    if (storedTheme || storedSidebarState) {
      dispatch(
        setThemeFromStorage({
          currentTheme: storedTheme,
          sidebarCollapsed: storedSidebarState,
          sidebarWidth: 256,
        })
      );
    }

    // Detect system theme
    dispatch(detectSystemTheme());

    // Initialize auth from storage if not already authenticated
    if (!isAuthenticated) {
      const storedToken = storageService.getAuthToken();
      const storedUser = storageService.getUserData();
      const storedRefreshToken = storageService.getRefreshToken();

      if (storedToken && storedUser) {
        dispatch(
          setAuthFromStorage({
            token: storedToken,
            user: storedUser,
            refreshToken: storedRefreshToken,
          })
        );

        // Try to refresh user data to ensure token is still valid
        if (storedToken) {
          dispatch(refreshUser());
        }
      }
    }

    // Set up system theme change listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => {
      dispatch(detectSystemTheme());
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export default AppInitializer;
