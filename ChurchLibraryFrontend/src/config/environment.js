// Environment configuration for the Church Library Admin Dashboard

const ENV = import.meta.env.MODE || "development";

// Base configuration
const baseConfig = {
  // Application settings
  appName: "Church Library Admin Dashboard",
  appVersion: "1.0.0",

  // API settings
  apiTimeout: 10000,
  apiRetries: 3,

  // Pagination defaults
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],

  // File upload settings
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],

  // Session settings
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Feature flags
  features: {
    darkMode: true,
    notifications: true,
    fileUpload: true,
    exportData: true,
    bulkOperations: true,
  },
};

// Development environment
const developmentConfig = {
  ...baseConfig,
  apiTimeout: 15000, // Longer timeout for development
  apiBaseUrl: "http://localhost:3001/api",
  enableLogging: true,
  enableMockData: true,
  features: {
    ...baseConfig.features,
    debugMode: true,
    mockData: true,
  },
};

// Production environment
const productionConfig = {
  ...baseConfig,
  apiBaseUrl: import.meta.env.VITE_API_URL || "https://api.churchlibrary.com",
  enableLogging: false,
  enableMockData: false,
  features: {
    ...baseConfig.features,
    debugMode: false,
    mockData: false,
  },
};

// Test environment
const testConfig = {
  ...baseConfig,
  apiBaseUrl: "http://localhost:3001/api",
  enableLogging: false,
  enableMockData: true,
  features: {
    ...baseConfig.features,
    debugMode: false,
    mockData: true,
  },
};

// Environment-specific configurations
const configs = {
  development: developmentConfig,
  production: productionConfig,
  test: testConfig,
};

// Get current configuration
const config = configs[ENV] || developmentConfig;

// Environment utilities
export const isDevelopment = ENV === "development";
export const isProduction = ENV === "production";
export const isTest = ENV === "test";

// Configuration getters
export const getApiBaseUrl = () => config.apiBaseUrl;
export const getApiTimeout = () => config.apiTimeout;
export const getDefaultPageSize = () => config.defaultPageSize;
export const getPageSizeOptions = () => config.pageSizeOptions;
export const getMaxFileSize = () => config.maxFileSize;
export const getAllowedFileTypes = () => config.allowedFileTypes;
export const getSessionTimeout = () => config.sessionTimeout;
export const getRefreshTokenExpiry = () => config.refreshTokenExpiry;
export const getFeatures = () => config.features;
export const isFeatureEnabled = (feature) => config.features[feature] || false;

// Logging utilities
export const log = {
  info: (message, data) => {
    if (config.enableLogging) {
      console.log(`[INFO] ${message}`, data);
    }
  },
  warn: (message, data) => {
    if (config.enableLogging) {
      console.warn(`[WARN] ${message}`, data);
    }
  },
  error: (message, data) => {
    if (config.enableLogging) {
      console.error(`[ERROR] ${message}`, data);
    }
  },
  debug: (message, data) => {
    if (config.enableLogging && isFeatureEnabled("debugMode")) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};

// Export configuration
export default config;
