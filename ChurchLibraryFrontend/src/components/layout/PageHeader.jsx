import React from "react";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../../store";
import Breadcrumb from "./Breadcrumb";

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  className = "",
}) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  const containerClasses = clsx(
    "mb-6 pb-6 border-b",
    isDarkMode ? "border-gray-700" : "border-gray-200",
    className
  );

  const titleClasses = clsx(
    "text-2xl font-bold",
    isDarkMode ? "text-white" : "text-gray-900"
  );

  const subtitleClasses = clsx(
    "mt-2 text-base",
    isDarkMode ? "text-gray-300" : "text-gray-600"
  );

  const actionsContainerClasses = clsx(
    "flex flex-wrap items-center gap-3 mt-4",
    "sm:mt-0 sm:ml-auto"
  );

  return (
    <div className={containerClasses}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} className="mb-2" />
          )}

          {/* Title and Subtitle */}
          <div>
            <h1 className={titleClasses}>{title}</h1>
            {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
          </div>
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className={actionsContainerClasses}>
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
