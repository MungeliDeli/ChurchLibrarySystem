// Base color palette
const COLORS = {
  // Primary brand color
  primary: {
    main: "#d4a373", // --buff color
    light: "#e4c4a1",
    dark: "#b8935f",
    contrast: "#ffffff",
  },

  // Secondary colors (warm earth tones)
  secondary: {
    main: "#a0673b",
    light: "#c8956d",
    dark: "#7d4f2c",
    contrast: "#ffffff",
  },

  // Accent colors
  accent: {
    main: "#8b5a3c",
    light: "#a67858",
    dark: "#6b4429",
    contrast: "#ffffff",
  },
};

// Light theme
const LIGHT_THEME = {
  // Background colors
  background: {
    primary: "#ffffff", // Main app background
    secondary: "#f8f6f3", // Card/section backgrounds
    tertiary: "#f0ebe4", // Subtle backgrounds
    overlay: "rgba(0,0,0,0.5)",
  },

  // Surface colors (cards, modals, etc.)
  surface: {
    primary: "#ffffff",
    secondary: "#f8f6f3",
    elevated: "#ffffff",
    disabled: "#e0e0e0",
  },

  // Text colors
  text: {
    primary: "#2c2c2c", // Main text
    secondary: "#5a5a5a", // Secondary text
    tertiary: "#8a8a8a", // Tertiary/hint text
    disabled: "#b0b0b0", // Disabled text
    inverse: "#ffffff", // Text on dark backgrounds
    link: "#d4a373", // Links
    error: "#d32f2f", // Error text
    success: "#2e7d32", // Success text
    warning: "#f57c00", // Warning text
  },

  // Border colors
  border: {
    primary: "#e0e0e0",
    secondary: "#d0d0d0",
    focus: "#d4a373",
    error: "#d32f2f",
  },

  // Status colors
  status: {
    error: "#d32f2f",
    success: "#2e7d32",
    warning: "#f57c00",
    info: "#1976d2",
  },

  // Component specific colors
  components: {
    header: "#ffffff",
    tabBar: "#ffffff",
    drawer: "#f8f6f3",
    button: {
      primary: "#d4a373",
      secondary: "#f8f6f3",
      outline: "transparent",
    },
    input: {
      background: "#ffffff",
      border: "#e0e0e0",
      focus: "#d4a373",
    },
  },
};

// Dark theme
const DARK_THEME = {
  // Background colors
  background: {
    primary: "#1a1a1a", // Main app background
    secondary: "#2c2c2c", // Card/section backgrounds
    tertiary: "#3a3a3a", // Subtle backgrounds
    overlay: "rgba(0,0,0,0.7)",
  },

  // Surface colors
  surface: {
    primary: "#2c2c2c",
    secondary: "#3a3a3a",
    elevated: "#404040",
    disabled: "#4a4a4a",
  },

  // Text colors
  text: {
    primary: "#ffffff", // Main text
    secondary: "#e0e0e0", // Secondary text
    tertiary: "#b0b0b0", // Tertiary/hint text
    disabled: "#6a6a6a", // Disabled text
    inverse: "#2c2c2c", // Text on light backgrounds
    link: "#e4c4a1", // Links (lighter primary)
    error: "#ff6b6b", // Error text
    success: "#51cf66", // Success text
    warning: "#ffd43b", // Warning text
  },

  // Border colors
  border: {
    primary: "#4a4a4a",
    secondary: "#5a5a5a",
    focus: "#e4c4a1",
    error: "#ff6b6b",
  },

  // Status colors
  status: {
    error: "#ff6b6b",
    success: "#51cf66",
    warning: "#ffd43b",
    info: "#339af0",
  },

  // Component specific colors
  components: {
    header: "#2c2c2c",
    tabBar: "#2c2c2c",
    drawer: "#1a1a1a",
    button: {
      primary: "#d4a373",
      secondary: "#3a3a3a",
      outline: "transparent",
    },
    input: {
      background: "#2c2c2c",
      border: "#4a4a4a",
      focus: "#e4c4a1",
    },
  },
};

// Typography system
const TYPOGRAPHY = {
  fonts: {
    regular: "System", // Use system font for now
    medium: "System",
    bold: "System",
    light: "System",
  },

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  weights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

// Spacing system (based on 4px grid)
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

// Shadows
const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
};

// Export themes
export const lightTheme = {
  colors: { ...COLORS, ...LIGHT_THEME },
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  isDark: false,
};

export const darkTheme = {
  colors: { ...COLORS, ...DARK_THEME },
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  isDark: true,
};

export { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS };
