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
  const variants = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-accent)] focus:ring-[var(--color-accent)]",
    outline:
      "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus:ring-[var(--color-primary)]",
    secondary:
      "bg-[var(--color-secondary)] text-[var(--color-on-secondary)] hover:bg-[var(--color-secondary-hover)] focus:ring-[var(--color-secondary)]",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

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
        variants[variant] || variants.primary,
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
