import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleThemeSidebar } from "../../store/slices/themeSlice";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";

const MobileMenu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarCollapsed = useSelector((state) => state.theme.sidebarCollapsed);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
      description: "Overview and statistics",
    },
    {
      name: "Library",
      href: "/dashboard/library",
      icon: "📚",
      description: "Manage books and resources",
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: "👥",
      description: "User management",
    },
    {
      name: "Statistics",
      href: "/dashboard/statistics",
      icon: "📈",
      description: "Analytics and reports",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: "⚙️",
      description: "Application settings",
    },
  ];

  const handleClose = () => {
    dispatch(toggleThemeSidebar());
  };

  if (sidebarCollapsed) return null;

  return (
    <div className="sm:hidden">
      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Mobile menu panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Church Library
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleClose}
                  className={clsx(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Church Library Admin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
