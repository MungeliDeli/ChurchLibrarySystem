import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import Button from "./Button";

const Toast = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  position = "top-right",
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Allow time for exit animation
  };

  const types = {
    success: {
      icon: "✅",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-600",
    },
    error: {
      icon: "❌",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
    },
    warning: {
      icon: "⚠️",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
    },
    info: {
      icon: "ℹ️",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
    },
  };

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const currentType = types[type];

  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        "fixed z-50 max-w-sm w-full",
        positions[position],
        "animate-slide-in"
      )}
    >
      <div
        className={clsx(
          "rounded-lg border p-4 shadow-lg transition-all duration-300",
          currentType.bgColor,
          currentType.borderColor,
          currentType.textColor
        )}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg">{currentType.icon}</span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
            {message && <p className="text-sm">{message}</p>}
          </div>
          {showCloseButton && (
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleClose}
                className={clsx(
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  currentType.iconColor,
                  "hover:bg-opacity-20 hover:bg-current"
                )}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;
