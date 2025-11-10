import React, { forwardRef } from "react";
import { clsx } from "clsx";

const Input = forwardRef(
  (
    {
      type = "text",
      label,
      placeholder,
      error,
      helperText,
      disabled = false,
      required = false,
      fullWidth = false,
      size = "medium",
      variant = "default",
      leftIcon,
      rightIcon,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";

    const variants = {
      default:
        "focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
      error:
        "border-[var(--color-error-border)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
      success:
        "border-[var(--color-success-border)] focus:border-[var(--color-success)] focus:ring-[var(--color-success)]",
    };

    const sizes = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const currentVariant = error ? "error" : variant;

    const inputClasses = clsx(
      baseClasses,
      variants[currentVariant],
      sizes[size],
      widthClass,
      disabled && "bg-[var(--color-background)] cursor-not-allowed opacity-50",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      className
    );

    return (
      <div className={clsx("space-y-1", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-[var(--color-primary-text)]">
            {label}
            {required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-[var(--color-icon-muted)]">{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-[var(--color-icon-muted)]">{rightIcon}</span>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={clsx(
              "text-sm",
              error
                ? "text-[var(--color-error)]"
                : "text-[var(--color-secondary-text)]"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
