import { createTheme } from "@mui/material/styles";

// Base colors matching mobile app
const BRAND_COLORS = {
  primary: {
    main: "#d4a373",
    light: "#e4c4a1",
    dark: "#b8935f",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#a0673b",
    light: "#c8956d",
    dark: "#7d4f2c",
    contrastText: "#ffffff",
  },
  accent: {
    main: "#8b5a3c",
    light: "#a67858",
    dark: "#6b4429",
    contrastText: "#ffffff",
  },
};

// Light theme configuration
const lightThemeConfig = {
  palette: {
    mode: "light",
    ...BRAND_COLORS,

    // Background colors
    background: {
      default: "#f8f6f3", // Main background
      paper: "#ffffff", // Cards, modals, sidebar
      secondary: "#f0ebe4", // Subtle backgrounds
      accent: "#faf9f7", // Header background
    },

    // Surface colors
    surface: {
      main: "#ffffff",
      elevated: "#ffffff",
      hover: "#f5f5f5",
      selected: "#e4c4a1", // Selected sidebar item
    },

    // Text colors
    text: {
      primary: "#2c2c2c", // Main text
      secondary: "#5a5a5a", // Secondary text
      disabled: "#b0b0b0", // Disabled text
      hint: "#8a8a8a", // Placeholder text
    },

    // Divider and borders
    divider: "rgba(0, 0, 0, 0.12)",

    // Status colors
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    warning: {
      main: "#f57c00",
      light: "#ff9800",
      dark: "#e65100",
    },
    info: {
      main: "#1976d2",
      light: "#2196f3",
      dark: "#0d47a1",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },

    // Custom colors for components
    sidebar: {
      background: "#ffffff",
      header: "#f8f6f3",
      item: {
        default: "transparent",
        hover: "#f5f5f5",
        active: "#e4c4a1",
        text: "#2c2c2c",
        activeText: "#b8935f",
      },
    },

    header: {
      background: "#ffffff",
      text: "#2c2c2c",
      border: "#e0e0e0",
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
  ],

  spacing: 8, // Base spacing unit

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
  },
};

// Dark theme configuration
const darkThemeConfig = {
  palette: {
    mode: "dark",
    ...BRAND_COLORS,

    // Background colors
    background: {
      default: "#1a1a1a", // Main background
      paper: "#2c2c2c", // Cards, modals, sidebar
      secondary: "#3a3a3a", // Subtle backgrounds
      accent: "#404040", // Header background
    },

    // Surface colors
    surface: {
      main: "#2c2c2c",
      elevated: "#404040",
      hover: "#4a4a4a",
      selected: "#b8935f", // Selected sidebar item (darker primary)
    },

    // Text colors
    text: {
      primary: "#ffffff", // Main text
      secondary: "#e0e0e0", // Secondary text
      disabled: "#6a6a6a", // Disabled text
      hint: "#b0b0b0", // Placeholder text
    },

    // Divider and borders
    divider: "rgba(255, 255, 255, 0.12)",

    // Status colors (brighter for dark theme)
    error: {
      main: "#ff6b6b",
      light: "#ff8a80",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ffd43b",
      light: "#ffeb3b",
      dark: "#f57c00",
    },
    info: {
      main: "#339af0",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    success: {
      main: "#51cf66",
      light: "#81c784",
      dark: "#2e7d32",
    },

    // Custom colors for components
    sidebar: {
      background: "#2c2c2c",
      header: "#1a1a1a",
      item: {
        default: "transparent",
        hover: "#4a4a4a",
        active: "#b8935f",
        text: "#ffffff",
        activeText: "#ffffff",
      },
    },

    header: {
      background: "#2c2c2c",
      text: "#ffffff",
      border: "#4a4a4a",
    },
  },

  // Inherit typography, shape, spacing from light theme
  typography: lightThemeConfig.typography,
  shape: lightThemeConfig.shape,
  spacing: lightThemeConfig.spacing,

  components: {
    ...lightThemeConfig.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          backgroundColor: "#2c2c2c",
        },
      },
    },
  },
};

// Create theme instances
export const lightTheme = createTheme(lightThemeConfig);
export const darkTheme = createTheme(darkThemeConfig);

// Theme context helper
export const getTheme = (isDark) => (isDark ? darkTheme : lightTheme);

// Export color constants for direct usage
export { BRAND_COLORS };
