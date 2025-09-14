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
import splashIcon from "../../assets/splash-icon.png";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPeople,
  MdBarChart,
  MdSettings,
} from "react-icons/md";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const isDarkMode = useSelector(selectIsDarkMode);
  const user = useSelector(selectUser);
  const { getRouteMetadata } = useNavigation();

  const navigation = [
    {
      name: "Dashboard",
      href: ROUTES.DASHBOARD,
      icon: MdDashboard,
      description: "Overview and statistics",
    },
    {
      name: "Library",
      href: ROUTES.LIBRARY,
      icon: MdLibraryBooks,
      description: "Manage books and resources",
    },
    {
      name: "Users",
      href: ROUTES.USERS,
      icon: MdPeople,
      description: "User management and profiles",
    },
    {
      name: "Statistics",
      href: ROUTES.STATISTICS,
      icon: MdBarChart,
      description: "Reports and analytics",
    },
    {
      name: "Settings",
      href: ROUTES.SETTINGS,
      icon: MdSettings,
      description: "Application configuration",
    },
  ];

  const filteredNavigation = navigation;

  const sidebarClasses = clsx(
    "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out",
    "bg-[var(--color-background)] border-r border-[var(--color-border)]",

    isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
  );

  const headerClasses = clsx(
    "flex items-center justify-center h-16 border-b border-[var(--color-border)] transition-all duration-300",
    "px-4"
  );

  const logoClasses = clsx(
    "font-bold transition-all duration-300 flex items-center space-x-2",
    "text-xl"
  );

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <h1 className={logoClasses}>
          <img src={splashIcon} alt="Church Library" className="w-8 h-8" />
          <span>Church Library</span>
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
                    "hover:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-inset",

                    isActive
                      ? clsx(
                          "bg-[var(--color-surface)] text-[var(--color-text-primary)] border-r-2 border-[var(--color-accent)]"
                        )
                      : clsx(
                          "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        )
                  )}
                  title={item.description}
                >
                  <item.icon className="text-lg mr-3 text-[var(--color-primary)]" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info Section */}
      {user && (
        <div className={clsx("absolute bottom-0 left-0 right-0 p-4 border-t")}>
          <div className="flex items-center space-x-3">
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              )}
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={clsx("text-sm font-medium truncate")}>
                {user.name || "User"}
              </p>
              <p className={clsx("text-xs truncate")}>{user.role || "User"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
