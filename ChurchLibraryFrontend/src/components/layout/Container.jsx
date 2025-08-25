import React from "react";
import { clsx } from "clsx";

const Container = ({
  children,
  size = "default",
  className = "",
  padding = "default",
  maxWidth = "default",
}) => {
  const sizeClasses = {
    small: "max-w-4xl",
    default: "max-w-7xl",
    large: "max-w-full",
    xl: "max-w-7xl",
    "2xl": "max-w-7xl",
  };

  const paddingClasses = {
    none: "",
    small: "px-4",
    default: "px-6",
    large: "px-8",
  };

  const maxWidthClasses = {
    none: "",
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    default: "max-w-7xl",
  };

  const containerClasses = clsx(
    "mx-auto",
    sizeClasses[size],
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    className
  );

  return <div className={containerClasses}>{children}</div>;
};

export default Container;
