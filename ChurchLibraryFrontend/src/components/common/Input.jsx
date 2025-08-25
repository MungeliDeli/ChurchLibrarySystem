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
      "block w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";

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

    const inputClasses = clsx(
      baseClasses,
      variants[currentVariant],
      sizes[size],
      widthClass,
      disabled && "bg-gray-50 cursor-not-allowed opacity-50",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
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
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{leftIcon}</span>
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
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
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

Input.displayName = "Input";

export default Input;
