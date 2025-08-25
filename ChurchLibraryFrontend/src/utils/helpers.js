import { format, parseISO, isValid } from "date-fns";

// Date formatting helpers
export const formatDate = (date, formatString = "MMM dd, yyyy") => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";

    return format(dateObj, formatString);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, "MMM dd, yyyy HH:mm");
};

export const formatRelativeTime = (date) => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";

    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(dateObj);
  } catch (error) {
    console.error("Relative time formatting error:", error);
    return "";
  }
};

// String helpers
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 50) => {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
};

export const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Number helpers
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
};

// Array helpers
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    // Handle null/undefined values
    if (aVal === null || aVal === undefined) aVal = "";
    if (bVal === null || bVal === undefined) bVal = "";

    // Handle string comparison
    if (typeof aVal === "string" && typeof bVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

export const unique = (array, key = null) => {
  if (key) {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  return [...new Set(array)];
};

// Object helpers
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  return Object.keys(obj)
    .filter((key) => !keys.includes(key))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
};

export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === "string") return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const isValidISBN = (isbn) => {
  // Basic ISBN validation (10 or 13 digits)
  const cleanISBN = isbn.replace(/[-\s]/g, "");
  return /^(\d{10}|\d{13})$/.test(cleanISBN);
};

// File helpers
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.split(".").pop().toLowerCase();
};

export const isValidFileType = (file, allowedTypes) => {
  if (!file || !allowedTypes) return false;
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension);
};

// URL helpers
export const buildQueryString = (params) => {
  if (!params || typeof params !== "object") return "";

  const queryParams = Object.entries(params)
    .filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return queryParams ? `?${queryParams}` : "";
};

export const parseQueryString = (queryString) => {
  if (!queryString) return {};

  return queryString
    .substring(1)
    .split("&")
    .reduce((params, param) => {
      const [key, value] = param.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
      return params;
    }, {});
};

// Color helpers
export const getStatusColor = (status) => {
  const statusColors = {
    active: "green",
    inactive: "gray",
    pending: "yellow",
    suspended: "red",
    available: "green",
    borrowed: "blue",
    lost: "red",
    reserved: "purple",
  };

  return statusColors[status?.toLowerCase()] || "gray";
};

export const getRoleColor = (role) => {
  const roleColors = {
    admin: "red",
    librarian: "blue",
    user: "green",
  };

  return roleColors[role?.toLowerCase()] || "gray";
};

// Debounce helper
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle helper
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Local storage helpers
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Error setting localStorage:", error);
    return false;
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error getting localStorage:", error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing localStorage:", error);
    return false;
  }
};

// Error handling helpers
export const handleError = (error, fallbackMessage = "An error occurred") => {
  console.error("Error:", error);

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
};

// Async helpers
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Export all helpers
export default {
  // Date helpers
  formatDate,
  formatDateTime,
  formatRelativeTime,

  // String helpers
  capitalize,
  truncate,
  slugify,

  // Number helpers
  formatNumber,
  formatCurrency,
  formatPercentage,

  // Array helpers
  groupBy,
  sortBy,
  unique,

  // Object helpers
  pick,
  omit,
  isEmpty,

  // Validation helpers
  isValidEmail,
  isValidPhone,
  isValidISBN,

  // File helpers
  formatFileSize,
  getFileExtension,
  isValidFileType,

  // URL helpers
  buildQueryString,
  parseQueryString,

  // Color helpers
  getStatusColor,
  getRoleColor,

  // Utility helpers
  debounce,
  throttle,

  // Storage helpers
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,

  // Error helpers
  handleError,
  retry,
};
