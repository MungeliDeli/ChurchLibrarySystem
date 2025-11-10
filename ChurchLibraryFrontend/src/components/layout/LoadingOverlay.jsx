import React from "react";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../../store";
import LoadingSpinner from "../common/LoadingSpinner";

const LoadingOverlay = ({
  isLoading = false,
  message = "Loading...",
  className = "",
  overlay = true,
}) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  if (!isLoading) return null;

  const overlayClasses = clsx(
    "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
    overlay && "bg-black bg-opacity-50",
    className
  );

  const contentClasses = clsx(
    "bg-[var(--color-background)] rounded-lg shadow-xl p-8 flex flex-col items-center space-y-4",
  
  );

  const messageClasses = clsx(
    "text-lg font-medium text-[var(--color-primary-text)]",
   
  );

  return (
    <div className={overlayClasses}>
      <div className={contentClasses}>
        <LoadingSpinner size="large" />
        <p className={messageClasses}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
