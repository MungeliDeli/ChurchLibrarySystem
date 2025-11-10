import React, { forwardRef } from "react";
import { clsx } from "clsx";

const Select = forwardRef(
  (
    {
      label,
      placeholder = "Select an option",
      options = [],
      error,
      helperText,
      disabled = false,
      required = false,
      fullWidth = false,
      size = "medium",
      variant = "default",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-primary-text)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none";

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

    const selectClasses = clsx(
      baseClasses,
      variants[currentVariant],
      sizes[size],
      widthClass,
      disabled && "bg-[var(--color-background)] cursor-not-allowed opacity-50",
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
          <select
            ref={ref}
            className={selectClasses}
            disabled={disabled}
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-4 w-4 text-[var(--color-icon-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
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

Select.displayName = "Select";

export default Select;
