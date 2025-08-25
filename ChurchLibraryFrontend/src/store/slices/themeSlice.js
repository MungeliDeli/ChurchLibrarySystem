import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { THEMES } from "../../utils/constants";

// Initial state
const initialState = {
  currentTheme: THEMES.LIGHT,
  systemTheme: THEMES.LIGHT, // Current system theme preference
  availableThemes: Object.values(THEMES),
  isDarkMode: false,
  sidebarCollapsed: false,
  sidebarWidth: 256, // Default sidebar width
  headerHeight: 64, // Default header height
  contentPadding: 24, // Default content padding
};

// Async thunk for detecting system theme
export const detectSystemTheme = createAsyncThunk(
  "theme/detectSystemTheme",
  async () => {
    // Check if window is available (for SSR compatibility)
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      return mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
    }
    return THEMES.LIGHT;
  }
);

// Theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Set theme
    setTheme: (state, action) => {
      const newTheme = action.payload;
      if (state.availableThemes.includes(newTheme)) {
        state.currentTheme = newTheme;
        state.isDarkMode = newTheme === THEMES.DARK;
      }
    },

    // Toggle between light and dark themes
    toggleTheme: (state) => {
      if (state.currentTheme === THEMES.LIGHT) {
        state.currentTheme = THEMES.DARK;
        state.isDarkMode = true;
      } else if (state.currentTheme === THEMES.DARK) {
        state.currentTheme = THEMES.LIGHT;
        state.isDarkMode = false;
      }
      // SYSTEM theme is handled by the system theme detection
    },

    // Set system theme
    setSystemTheme: (state, action) => {
      state.systemTheme = action.payload;
      // If current theme is set to system, update the effective theme
      if (state.currentTheme === THEMES.SYSTEM) {
        state.isDarkMode = action.payload === THEMES.DARK;
      }
    },

    // Toggle sidebar (renamed to avoid conflict)
    toggleThemeSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // Set sidebar state
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },

    // Set sidebar width
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload;
    },

    // Set header height
    setHeaderHeight: (state, action) => {
      state.headerHeight = action.payload;
    },

    // Set content padding
    setContentPadding: (state, action) => {
      state.contentPadding = action.payload;
    },

    // Reset theme to defaults
    resetTheme: (state) => {
      state.currentTheme = THEMES.LIGHT;
      state.isDarkMode = false;
      state.sidebarCollapsed = false;
      state.sidebarWidth = 256;
      state.headerHeight = 64;
      state.contentPadding = 24;
    },

    // Set theme from storage (for persistence)
    setThemeFromStorage: (state, action) => {
      const { currentTheme, sidebarCollapsed, sidebarWidth } = action.payload;
      if (currentTheme && state.availableThemes.includes(currentTheme)) {
        state.currentTheme = currentTheme;
        state.isDarkMode = currentTheme === THEMES.DARK;
      }
      if (typeof sidebarCollapsed === "boolean") {
        state.sidebarCollapsed = sidebarCollapsed;
      }
      if (typeof sidebarWidth === "number") {
        state.sidebarWidth = sidebarWidth;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(detectSystemTheme.fulfilled, (state, action) => {
      state.systemTheme = action.payload;
      // If current theme is set to system, update the effective theme
      if (state.currentTheme === THEMES.SYSTEM) {
        state.isDarkMode = action.payload === THEMES.DARK;
      }
    });
  },
});

// Export actions
export const {
  setTheme,
  toggleTheme,
  setSystemTheme,
  toggleThemeSidebar,
  setSidebarCollapsed,
  setSidebarWidth,
  setHeaderHeight,
  setContentPadding,
  resetTheme,
  setThemeFromStorage,
} = themeSlice.actions;

// Export selectors
export const selectTheme = (state) => state.theme;
export const selectCurrentTheme = (state) => state.theme.currentTheme;
export const selectSystemTheme = (state) => state.theme.systemTheme;
export const selectIsDarkMode = (state) => state.theme.isDarkMode;
export const selectAvailableThemes = (state) => state.theme.availableThemes;
export const selectSidebarCollapsed = (state) => state.theme.sidebarCollapsed;
export const selectSidebarWidth = (state) => state.theme.sidebarWidth;
export const selectHeaderHeight = (state) => state.theme.headerHeight;
export const selectContentPadding = (state) => state.theme.contentPadding;

// Helper selector to get effective theme (handles system theme)
export const selectEffectiveTheme = (state) => {
  const { currentTheme, systemTheme } = state.theme;
  if (currentTheme === THEMES.SYSTEM) {
    return systemTheme;
  }
  return currentTheme;
};

// Helper selector to get effective dark mode state
export const selectEffectiveDarkMode = (state) => {
  const { currentTheme, systemTheme } = state.theme;
  if (currentTheme === THEMES.SYSTEM) {
    return systemTheme === THEMES.DARK;
  }
  return currentTheme === THEMES.DARK;
};

// Export reducer
export default themeSlice.reducer;
