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
      container:
        "bg-[var(--color-success-surface)] border-[var(--color-success-border)] text-[var(--color-success-text)]",
      iconColor: "text-[var(--color-success)]",
      focusRing: "focus:ring-[var(--color-success)]",
    },
    error: {
      icon: "❌",
      container:
        "bg-[var(--color-error-surface)] border-[var(--color-error-border)] text-[var(--color-error-text)]",
      iconColor: "text-[var(--color-error)]",
      focusRing: "focus:ring-[var(--color-error)]",
    },
    warning: {
      icon: "⚠️",
      container:
        "bg-[var(--color-warning-surface)] border-[var(--color-warning-border)] text-[var(--color-warning-text)]",
      iconColor: "text-[var(--color-warning)]",
      focusRing: "focus:ring-[var(--color-warning)]",
    },
    info: {
      icon: "ℹ️",
      container:
        "bg-[var(--color-info-surface)] border-[var(--color-info-border)] text-[var(--color-info-text)]",
      iconColor: "text-[var(--color-info)]",
      focusRing: "focus:ring-[var(--color-info)]",
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

  const currentType = types[type] ?? types.info;

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
          "rounded-lg border p-4 shadow-lg transition-all duration-300 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-primary-text)]",
          currentType.container
        )}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className={clsx("text-lg", currentType.iconColor)}>
              {currentType.icon}
            </span>
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
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-[var(--color-surface-hover)]",
                  currentType.iconColor,
                  currentType.focusRing
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
