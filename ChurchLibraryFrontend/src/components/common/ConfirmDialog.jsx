import React from "react";
import { clsx } from "clsx";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[var(--color-overlay)] transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl max-w-md w-full mx-auto">
          <div className="p-6">
            <h3 className="text-lg font-medium text-[var(--color-primary-text)] mb-2">
              {title}
            </h3>
            <p className="text-sm text-[var(--color-secondary-text)] mb-6">
              {message}
            </p>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" size="medium" onClick={onClose}>
                {cancelText}
              </Button>
              <Button variant={variant} size="medium" onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
