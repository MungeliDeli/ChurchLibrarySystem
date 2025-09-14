import React from "react";
import { clsx } from "clsx";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)] focus:ring-[var(--color-accent)]";



  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={clsx(
        baseClasses,
        sizes[size],
        widthClass,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
