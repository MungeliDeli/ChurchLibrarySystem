// Application Constants
export const APP_NAME = "Church Library Admin Dashboard";
export const APP_VERSION = "1.0.0";

// API Endpoints
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  BOOKS: {
    LIST: "/books",
    CREATE: "/books",
    UPDATE: "/books/:id",
    DELETE: "/books/:id",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
  },
  STATISTICS: {
    DASHBOARD: "/statistics/dashboard",
    REPORTS: "/statistics/reports",
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  SIDEBAR_STATE: "sidebar_state",
};

// Theme Options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  LIBRARIAN: "librarian",
  USER: "user",
};

// Book Categories
export const BOOK_CATEGORIES = [
  "Bible Study",
  "Devotional",
  "Theology",
  "Christian Living",
  "History",
  "Biography",
  "Fiction",
  "Children",
  "Youth",
  "Other",
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  API: "yyyy-MM-dd",
  DATETIME: "MMM dd, yyyy HH:mm",
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`,
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
};
