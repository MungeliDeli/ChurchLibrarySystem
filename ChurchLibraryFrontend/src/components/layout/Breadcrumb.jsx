import React from "react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../../store";
import { useNavigation } from "../../hooks/useNavigation";

const Breadcrumb = () => {
  const location = useLocation();
  const isDarkMode = useSelector(selectIsDarkMode);
  const { getBreadcrumbs, getRouteMetadata } = useNavigation();

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumb for root or login page
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol
        className={clsx(
          "flex items-center space-x-2 text-sm text-[var(--color-secondary-text)]"
        )}
      >
        <li>
          <Link
            to="/dashboard"
            className={clsx(
              "hover:text-[var(--color-primary-text)] transition-colors duration-200",
              
            )}
          >
            Home
          </Link>
        </li>

        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            <span
              className={clsx(
                "mx-2 text-[var(--color-secondary-text)]"
              )}
            >
              /
            </span>

            {breadcrumb.isLast ? (
              <span
                className={clsx(
                  "font-medium text-[var(--color-primary-text)]",
             
                )}
              >
                {breadcrumb.title}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className={clsx(
                  "hover:text-[var(--color-primary-text)] transition-colors duration-200",
                  
                )}
              >
                {breadcrumb.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
