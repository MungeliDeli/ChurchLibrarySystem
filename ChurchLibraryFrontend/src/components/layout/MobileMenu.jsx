import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleThemeSidebar } from "../../store/slices/themeSlice";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPeople,
  MdBarChart,
  MdSettings,
} from "react-icons/md";

const MobileMenu = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarCollapsed = useSelector((state) => state.theme.sidebarCollapsed);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: MdDashboard,
      description: "Overview and statistics",
    },
    {
      name: "Library",
      href: "/dashboard/library",
      icon: MdLibraryBooks,
      description: "Manage books and resources",
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: MdPeople,
      description: "User management",
    },
    {
      name: "Statistics",
      href: "/dashboard/statistics",
      icon: MdBarChart,
      description: "Analytics and reports",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: MdSettings,
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
        className="fixed inset-0 bg-black/30 z-40"
        onClick={handleClose}
      />

      {/* Mobile menu panel */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-sidebar-bg)] shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-sidebar-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-sidebar-text)]">
              Church Library
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-md text-[var(--color-sidebar-text-secondary)] hover:text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]"
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
                      ? "bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-text)]"
                      : "text-[var(--color-sidebar-text-secondary)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-text)]"
                  )}
                >
                  <item.icon className="mr-3 text-lg text-[var(--color-sidebar-text)]" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-[var(--color-sidebar-text-secondary)]">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--color-sidebar-border)]">
            <div className="text-xs text-[var(--color-sidebar-text-secondary)] text-center">
              Church Library Admin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
