import { useState, useEffect, useCallback } from "react";
import storageService from "../services/storageService";
import { THEMES } from "../utils/constants";

export const useTheme = () => {
  const [theme, setThemeState] = useState(() => {
    // Initialize theme from storage or default to light
    return storageService.getTheme();
  });

  // Apply theme to document
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Add new theme class
    root.classList.add(newTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        newTheme === "dark" ? "#1f2937" : "#ffffff"
      );
    }
  }, []);

  // Set theme and save to storage
  const setTheme = useCallback(
    (newTheme) => {
      if (!Object.values(THEMES).includes(newTheme)) {
        console.warn(`Invalid theme: ${newTheme}`);
        return;
      }

      setThemeState(newTheme);
      storageService.setTheme(newTheme);
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        const systemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        applyTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, applyTheme]);

  // Get current effective theme (handles system theme)
  const getEffectiveTheme = useCallback(() => {
    if (theme === THEMES.SYSTEM) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEMES.DARK
        : THEMES.LIGHT;
    }
    return theme;
  }, [theme]);

  // Check if current theme is dark
  const isDark = useCallback(() => {
    return getEffectiveTheme() === THEMES.DARK;
  }, [getEffectiveTheme]);

  // Check if current theme is light
  const isLight = useCallback(() => {
    return getEffectiveTheme() === THEMES.LIGHT;
  }, [getEffectiveTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    getEffectiveTheme,
    isDark,
    isLight,
    availableThemes: THEMES,
  };
};
