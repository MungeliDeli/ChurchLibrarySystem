import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleThemeSidebar,
  selectSidebarCollapsed,
  selectIsDarkMode,
} from "../../store";
import { clsx } from "clsx";

const SidebarToggle = ({
  className = "",
  showOnMobile = true,
  showOnDesktop = false,
}) => {
  const dispatch = useDispatch();
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const isDarkMode = useSelector(selectIsDarkMode);

  const handleToggle = () => {
    dispatch(toggleThemeSidebar());
  };

  const buttonClasses = clsx(
    "p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    "text-gray-400 hover:text-gray-500 hover:bg-gray-100",
    isDarkMode && "hover:bg-gray-700 hover:text-gray-300 focus:ring-blue-400",
    "focus:ring-blue-500",
    "md:hidden", // Hidden on desktop by default
    showOnDesktop && "md:block", // Show on desktop if specified
    className
  );

  return (
    <button
      onClick={handleToggle}
      className={buttonClasses}
      title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <span className="sr-only">Toggle sidebar</span>
      {sidebarCollapsed ? (
        // Expand icon
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ) : (
        // Collapse icon
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </button>
  );
};

export default SidebarToggle;
