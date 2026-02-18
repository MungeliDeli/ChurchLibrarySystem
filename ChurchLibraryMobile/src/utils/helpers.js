import { VALIDATION } from "./constants";

export function isEmail(value) {
  return VALIDATION.emailRegex.test(String(value || "").toLowerCase());
}

export function formatErrorMessage(errorLike) {
  if (!errorLike) return "Something went wrong";
  if (typeof errorLike === "string") return errorLike;
  if (errorLike.message) return errorLike.message;
  try {
    return JSON.stringify(errorLike);
  } catch {
    return "Unknown error";
  }
}

export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // invalid date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
