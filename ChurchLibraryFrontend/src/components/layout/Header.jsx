import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleTheme,
  selectCurrentTheme,
  selectSidebarCollapsed,
  selectUser,
  selectIsDarkMode,
} from "../../store";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "../../hooks/useNavigation";
import { THEMES } from "../../utils/constants";
import { clsx } from "clsx";
import SidebarToggle from "./SidebarToggle";
import Breadcrumb from "./Breadcrumb";
import NavigationHistory from "../common/NavigationHistory";

const Header = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectCurrentTheme);
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const user = useSelector(selectUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const { logout } = useAuth();
  const { goBack, navigationHistory } = useNavigation();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNavigationHistory, setShowNavigationHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    await logout();
  };

  const handleGoBack = () => {
    goBack();
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const headerClasses = clsx(
    "sticky top-0 z-30 transition-all duration-300 ease-in-out",
    "bg-white border-b border-gray-200 px-4 py-2",
    isDarkMode && "bg-gray-800 border-gray-700"
  );

  const buttonClasses = clsx(
    "p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    "text-gray-400 hover:text-gray-500 hover:bg-gray-100",
    isDarkMode && "hover:bg-gray-700 hover:text-gray-300 focus:ring-blue-400",
    "focus:ring-blue-500"
  );

  const profileButtonClasses = clsx(
    "flex items-center space-x-2 p-2 rounded-lg transition-all duration-200",
    "text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2",
    isDarkMode && "hover:bg-gray-700 hover:text-gray-300 focus:ring-blue-400",
    "focus:ring-blue-500"
  );

  const dropdownClasses = clsx(
    "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200",
    isDarkMode && "bg-gray-800 border-gray-700 shadow-xl"
  );

  return (
    <>
      <header className={headerClasses}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle - Only show on mobile */}
            {isMobile && (
              <SidebarToggle showOnMobile={true} showOnDesktop={false} />
            )}

            {/* Breadcrumb */}
            <div className="hidden sm:block">
              <Breadcrumb />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className={buttonClasses}
              title={`Switch to ${
                currentTheme === THEMES.LIGHT ? "dark" : "light"
              } theme`}
            >
              <span className="sr-only">Toggle theme</span>
              {currentTheme === THEMES.LIGHT ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <button className={buttonClasses} title="Notifications">
              <span className="sr-only">View notifications</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={profileButtonClasses}
              >
                {/* Profile Picture Circle */}
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-300 text-gray-700"
                  )}
                >
                  {getUserInitials(user?.name || user?.email)}
                </div>

                {/* Dropdown Arrow */}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className={dropdownClasses}>
                  <div
                    className={clsx(
                      "px-4 py-2 border-b",
                      isDarkMode ? "border-gray-700" : "border-gray-100"
                    )}
                  >
                    <p
                      className={clsx(
                        "text-sm font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}
                    >
                      {user?.name || "User"}
                    </p>
                    <p
                      className={clsx(
                        "text-sm",
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      )}
                    >
                      {user?.email}
                    </p>
                    <p
                      className={clsx(
                        "text-xs capitalize",
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      )}
                    >
                      {user?.role || "User"}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowProfileDropdown(false)}
                    className={clsx(
                      "block w-full text-left px-4 py-2 text-sm transition-colors duration-200",
                      isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    Profile Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className={clsx(
                      "block w-full text-left px-4 py-2 text-sm transition-colors duration-200",
                      "text-red-600 hover:bg-red-50",
                      isDarkMode && "text-red-400 hover:bg-red-900"
                    )}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {showProfileDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileDropdown(false)}
          />
        )}
      </header>

      {/* Navigation History Modal */}
      <NavigationHistory
        isOpen={showNavigationHistory}
        onClose={() => setShowNavigationHistory(false)}
      />
    </>
  );
};

export default Header;
