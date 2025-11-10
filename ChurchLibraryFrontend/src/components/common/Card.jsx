import React from "react";
import { clsx } from "clsx";

const Card = ({
  children,
  className = "",
  padding = "default",
  shadow = "default",
  ...props
}) => {
  const paddingClasses = {
    none: "",
    small: "p-3",
    default: "p-6",
    large: "p-8",
  };

  const shadowClasses = {
    none: "",
    small: "shadow-sm",
    default: "shadow-md",
    large: "shadow-lg",
  };

  return (
    <div
      className={clsx(
        "bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]",
        paddingClasses[padding],
        shadowClasses[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
