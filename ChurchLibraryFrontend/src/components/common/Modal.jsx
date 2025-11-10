import React, { useEffect } from "react";
import { clsx } from "clsx";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  ...props
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  const sizes = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    xlarge: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[var(--color-overlay)] transition-opacity"
          onClick={closeOnBackdropClick ? onClose : undefined}
        />

        {/* Modal */}
        <div
          className={clsx(
            "relative bg-[var(--color-surface)] rounded-lg shadow-xl w-full mx-auto border border-[var(--color-border)]",
            sizes[size],
            "animate-modal-in",
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              {title && (
                <h3 className="text-lg font-medium text-[var(--color-primary-text)]">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-[var(--color-icon-muted)] hover:text-[var(--color-secondary-text)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
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
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
