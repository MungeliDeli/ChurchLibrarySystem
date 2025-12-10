import React, { useState, useEffect } from "react";
import { activityLogsAPI } from "../../services/api";
import { addToast } from "../../store/slices/uiSlice";
import { useDispatch } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import Button from "./Button";
import { clsx } from "clsx";
import { MdSearch, MdDownload, MdArchive, MdFilterList, MdClear } from "react-icons/md";

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: "",
    actionType: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      };
      const data = await activityLogsAPI.getActivityLogs(params);
      setLogs(data.logs || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      dispatch(
        addToast({
          message: error.message || "Failed to fetch activity logs",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      userId: "",
      actionType: "",
      startDate: "",
      endDate: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleExport = async (format) => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );
      await activityLogsAPI.exportActivityLogs(params, format);
      dispatch(
        addToast({
          message: `Activity logs exported successfully as ${format.toUpperCase()}`,
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        addToast({
          message: error.message || "Failed to export activity logs",
          type: "error",
        })
      );
    }
  };

  const handleArchive = async () => {
    if (selectedLogs.length === 0) {
      dispatch(
        addToast({
          message: "Please select logs to archive",
          type: "warning",
        })
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to archive ${selectedLogs.length} log(s)?`
      )
    ) {
      return;
    }

    try {
      await activityLogsAPI.archiveActivityLogs({ logIds: selectedLogs });
      dispatch(
        addToast({
          message: `Successfully archived ${selectedLogs.length} log(s)`,
          type: "success",
        })
      );
      setSelectedLogs([]);
      fetchLogs();
    } catch (error) {
      dispatch(
        addToast({
          message: error.message || "Failed to archive logs",
          type: "error",
        })
      );
    }
  };

  const handleSelectLog = (logId) => {
    setSelectedLogs((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(logs.map((log) => log.logId));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-h1 text-[var(--color-primary-text)] mb-2">
          Activity Logs
        </h1>
        <p className="text-subheading text-[var(--color-secondary-text)]">
          View and manage system activity logs
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MdFilterList className="text-lg" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>

        {selectedLogs.length > 0 && (
          <Button
            onClick={handleArchive}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MdArchive className="text-lg" />
            Archive Selected ({selectedLogs.length})
          </Button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={() => handleExport("json")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MdDownload className="text-lg" />
            Export JSON
          </Button>
          <Button
            onClick={() => handleExport("csv")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MdDownload className="text-lg" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-[var(--color-surface)] rounded-lg border-faint">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-primary-text)] mb-1">
                User ID
              </label>
              <input
                type="text"
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                placeholder="Filter by user ID"
                className="w-full px-3 py-2 border-faint rounded-lg bg-[var(--color-background)] text-[var(--color-primary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-primary-text)] mb-1">
                Action Type
              </label>
              <input
                type="text"
                value={filters.actionType}
                onChange={(e) =>
                  handleFilterChange("actionType", e.target.value)
                }
                placeholder="Filter by action"
                className="w-full px-3 py-2 border-faint rounded-lg bg-[var(--color-background)] text-[var(--color-primary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-primary-text)] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="w-full px-3 py-2 border-faint rounded-lg bg-[var(--color-background)] text-[var(--color-primary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-primary-text)] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border-faint rounded-lg bg-[var(--color-background)] text-[var(--color-primary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button onClick={handleApplyFilters} className="flex items-center gap-2">
              <MdSearch className="text-lg" />
              Apply Filters
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MdClear className="text-lg" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-lg border-faint overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-surface)] border-b border-faint">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        logs.length > 0 && selectedLogs.length === logs.length
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-primary-text)]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-primary-text)]">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-primary-text)]">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-primary-text)]">
                    Resource
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-primary-text)]">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-faint">
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-[var(--color-secondary-text)]"
                    >
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.logId}
                      className={clsx(
                        "hover:bg-[var(--color-surface-hover)] transition-colors",
                        selectedLogs.includes(log.logId) &&
                          "bg-[var(--color-primary-surface)]"
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(log.logId)}
                          onChange={() => handleSelectLog(log.logId)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-primary-text)]">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-primary-text)]">
                        <div>
                          <div className="font-medium">
                            {log.User?.name || "N/A"}
                          </div>
                          <div className="text-xs text-[var(--color-secondary-text)]">
                            {log.User?.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-primary-text)]">
                        <span className="px-2 py-1 rounded bg-[var(--color-info-surface)] text-[var(--color-info-text)] text-xs font-medium">
                          {log.actionType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-primary-text)]">
                        <div className="max-w-xs truncate" title={log.affectedResource}>
                          {log.affectedResource || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-secondary-text)]">
                        {log.ipAddress || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-faint flex items-center justify-between">
              <div className="text-sm text-[var(--color-secondary-text)]">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} logs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-[var(--color-primary-text)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;

