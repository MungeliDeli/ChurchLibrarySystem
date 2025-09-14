import React from "react";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../../store";

const MainContent = ({ children, className = "", padding = "default" }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  const paddingClasses = {
    none: "",
    small: "p-4",
    default: "p-6",
    large: "p-8",
  };

  const contentClasses = clsx(
    "min-h-screen transition-all duration-300 ease-in-out",
    paddingClasses[padding],
    "bg-[var(--color-background)]",
   
    className
  );

  return (
    <main className={contentClasses}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
};

export default MainContent;
