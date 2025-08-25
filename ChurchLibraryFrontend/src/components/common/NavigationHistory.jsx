import React, { useState } from "react";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../../store";
import { useNavigation } from "../../hooks/useNavigation";
import { formatDistanceToNow } from "date-fns";

const NavigationHistory = ({ isOpen, onClose }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const { navigationHistory, goBack, clearHistory } = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  const recentHistory = navigationHistory.slice(0, isExpanded ? 10 : 5);

  const handleGoBack = (index) => {
    // Navigate back to the specified history entry
    if (index > 0) {
      const targetRoute = navigationHistory[index]?.path;
      if (targetRoute) {
        goBack(targetRoute);
        onClose();
      }
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    onClose();
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black bg-opacity-50"
      )}
    >
      <div
        className={clsx(
          "w-full max-w-md mx-4 rounded-lg shadow-xl",
          "bg-white border border-gray-200",
          isDarkMode && "bg-gray-800 border-gray-700"
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "flex items-center justify-between p-4 border-b",
            isDarkMode ? "border-gray-700" : "border-gray-200"
          )}
        >
          <h3
            className={clsx(
              "text-lg font-medium",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            Navigation History
          </h3>
          <button
            onClick={onClose}
            className={clsx(
              "p-1 rounded-md hover:bg-gray-100 transition-colors",
              isDarkMode && "hover:bg-gray-700"
            )}
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {recentHistory.length === 0 ? (
            <p
              className={clsx(
                "text-center py-8",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              No navigation history available
            </p>
          ) : (
            <div className="space-y-2">
              {recentHistory.map((entry, index) => (
                <div
                  key={`${entry.path}-${entry.timestamp}`}
                  className={clsx(
                    "flex items-center justify-between p-3 rounded-lg cursor-pointer",
                    "hover:bg-gray-50 transition-colors",
                    isDarkMode && "hover:bg-gray-700",
                    index === 0 &&
                      clsx(
                        "bg-blue-50 border border-blue-200",
                        isDarkMode && "bg-blue-900 border-blue-700"
                      )
                  )}
                  onClick={() => handleGoBack(index)}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        "text-sm font-medium truncate",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}
                    >
                      {entry.title || entry.path}
                    </p>
                    <p
                      className={clsx(
                        "text-xs truncate",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      {entry.path}
                    </p>
                    <p
                      className={clsx(
                        "text-xs",
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      )}
                    >
                      {formatDistanceToNow(entry.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {index === 0 && (
                    <span
                      className={clsx(
                        "text-xs px-2 py-1 rounded-full",
                        "bg-blue-100 text-blue-800",
                        isDarkMode && "bg-blue-800 text-blue-200"
                      )}
                    >
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Show more/less button */}
          {navigationHistory.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={clsx(
                "w-full mt-4 py-2 text-sm font-medium rounded-lg",
                "hover:bg-gray-100 transition-colors",
                isDarkMode && "hover:bg-gray-700"
              )}
            >
              {isExpanded
                ? "Show Less"
                : `Show ${navigationHistory.length - 5} More`}
            </button>
          )}
        </div>

        {/* Footer */}
        <div
          className={clsx(
            "flex items-center justify-between p-4 border-t",
            isDarkMode ? "border-gray-700" : "border-gray-200"
          )}
        >
          <span
            className={clsx(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            {navigationHistory.length} entries
          </span>
          <button
            onClick={handleClearHistory}
            className={clsx(
              "px-3 py-1 text-sm rounded-md",
              "text-red-600 hover:bg-red-50 transition-colors",
              isDarkMode && "hover:bg-red-900"
            )}
          >
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationHistory;
