import React from "react";
import { clsx } from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectSidebarCollapsed,
  selectIsDarkMode,
  selectUser,
} from "../../store";
import { useNavigation } from "../../hooks/useNavigation";
import { ROUTES } from "../../services/navigationService";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const isDarkMode = useSelector(selectIsDarkMode);
  const user = useSelector(selectUser);
  const { canAccessRoute, getRouteMetadata } = useNavigation();

  const navigation = [
    {
      name: "Dashboard",
      href: ROUTES.DASHBOARD,
      icon: "📊",
      description: "Overview and statistics",
    },
    {
      name: "Library",
      href: ROUTES.LIBRARY,
      icon: "📚",
      description: "Manage books and resources",
    },
    {
      name: "Users",
      href: ROUTES.USERS,
      icon: "👥",
      description: "User management and profiles",
    },
    {
      name: "Statistics",
      href: ROUTES.STATISTICS,
      icon: "📈",
      description: "Reports and analytics",
    },
    {
      name: "Settings",
      href: ROUTES.SETTINGS,
      icon: "⚙️",
      description: "Application configuration",
    },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) =>
    canAccessRoute(item.href)
  );

  const sidebarClasses = clsx(
    "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out",
    "bg-white border-r border-gray-200",
    isDarkMode && "bg-gray-800 border-gray-700",
    isOpen ? "w-64 translate-x-0" : "w-16 -translate-x-0",
    sidebarCollapsed && "w-16"
  );

  const headerClasses = clsx(
    "flex items-center justify-center h-16 border-b border-gray-200 transition-all duration-300",
    isDarkMode && "border-gray-700 bg-gray-900",
    sidebarCollapsed ? "px-2" : "px-4"
  );

  const logoClasses = clsx(
    "font-bold transition-all duration-300",
    sidebarCollapsed ? "text-lg" : "text-xl",
    isDarkMode ? "text-white" : "text-gray-900"
  );

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <h1 className={logoClasses}>
          {sidebarCollapsed ? "CL" : "Church Library"}
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            const routeMetadata = getRouteMetadata(item.href);

            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={clsx(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
                    isDarkMode && "hover:bg-gray-700 focus:ring-blue-400",
                    isActive
                      ? clsx(
                          "bg-blue-50 text-blue-700 border-r-2 border-blue-700",
                          isDarkMode &&
                            "bg-blue-900 text-blue-200 border-blue-400"
                        )
                      : clsx(
                          "text-gray-600 hover:text-gray-900",
                          isDarkMode && "text-gray-300 hover:text-white"
                        )
                  )}
                  title={sidebarCollapsed ? item.description : undefined}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info Section */}
      {!sidebarCollapsed && user && (
        <div
          className={clsx(
            "absolute bottom-0 left-0 right-0 p-4 border-t",
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          )}
        >
          <div className="flex items-center space-x-3">
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isDarkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-700"
              )}
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={clsx(
                  "text-sm font-medium truncate",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}
              >
                {user.name || "User"}
              </p>
              <p
                className={clsx(
                  "text-xs truncate",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}
              >
                {user.role || "User"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
