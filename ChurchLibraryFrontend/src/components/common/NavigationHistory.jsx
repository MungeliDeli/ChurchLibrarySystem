import React, { useState } from "react";
import { clsx } from "clsx";
import { useNavigation } from "../../hooks/useNavigation";
import { formatDistanceToNow } from "date-fns";

const NavigationHistory = ({ isOpen, onClose }) => {
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
        "bg-[var(--color-overlay)]"
      )}
    >
      <div
        className={clsx(
          "w-full max-w-md mx-4 rounded-lg shadow-xl",
          "bg-[var(--color-surface)] border border-[var(--color-border)]"
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "flex items-center justify-between p-4 border-b border-[var(--color-border)]"
          )}
        >
          <h3
            className={clsx(
              "text-lg font-medium text-[var(--color-primary-text)]"
            )}
          >
            Navigation History
          </h3>
          <button
            onClick={onClose}
            className={clsx(
              "p-1 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-icon-muted)]"
            )}
          >
            <span className="text-xl text-[var(--color-primary-text)]">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {recentHistory.length === 0 ? (
            <p
              className={clsx(
                "text-center py-8 text-[var(--color-secondary-text)]"
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
                    "hover:bg-[var(--color-surface-hover)] transition-colors",
                    index === 0 &&
                      "bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)]"
                  )}
                  onClick={() => handleGoBack(index)}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        "text-sm font-medium truncate text-[var(--color-primary-text)]"
                      )}
                    >
                      {entry.title || entry.path}
                    </p>
                    <p
                      className={clsx(
                        "text-xs truncate text-[var(--color-secondary-text)]"
                      )}
                    >
                      {entry.path}
                    </p>
                    <p
                      className={clsx(
                        "text-xs text-[var(--color-secondary-text)]"
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
                        "bg-[var(--color-primary-surface)] text-[var(--color-primary)]"
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
                "w-full mt-4 py-2 text-sm font-medium rounded-lg text-[var(--color-primary-text)]",
                "hover:bg-[var(--color-surface-hover)] transition-colors"
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
            "flex items-center justify-between p-4 border-t border-[var(--color-border)]"
          )}
        >
          <span
            className={clsx(
              "text-sm text-[var(--color-secondary-text)]"
            )}
          >
            {navigationHistory.length} entries
          </span>
          <button
            onClick={handleClearHistory}
            className={clsx(
              "px-3 py-1 text-sm rounded-md text-[var(--color-error)]",
              "hover:bg-[var(--color-error-surface)] transition-colors"
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
