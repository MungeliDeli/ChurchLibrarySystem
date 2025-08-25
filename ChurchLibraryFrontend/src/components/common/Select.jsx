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
      "block w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none bg-white";

    const variants = {
      default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
      error: "border-red-300 focus:border-red-500 focus:ring-red-500",
      success: "border-green-300 focus:border-green-500 focus:ring-green-500",
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
      disabled && "bg-gray-50 cursor-not-allowed opacity-50",
      className
    );

    return (
      <div className={clsx("space-y-1", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
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
              className="h-4 w-4 text-gray-400"
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
              error ? "text-red-600" : "text-gray-500"
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
