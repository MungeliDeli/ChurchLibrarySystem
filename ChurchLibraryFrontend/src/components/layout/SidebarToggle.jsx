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
    "sm:hidden", // Hidden on desktop by default (above 640px)
    showOnDesktop && "sm:block", // Show on desktop if specified
    className
  );

  return (
    <button
      onClick={handleToggle}
      className={buttonClasses}
      title="Toggle mobile menu"
      aria-label="Toggle mobile menu"
    >
      <span className="sr-only">Toggle mobile menu</span>
      {/* Hamburger icon */}
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
    </button>
  );
};

export default SidebarToggle;
