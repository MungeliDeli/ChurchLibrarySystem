import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { usersAPI } from "../../services/api";
import storageService from "../../services/storageService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated before making request
      const token = storageService.getAuthToken();
      if (!token) {
        setError("You are not authenticated. Please log in to view users.");
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const response = await usersAPI.getUsers();
      
      // Check if response is valid
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      // Handle different response structures
      let usersData = response.data?.data || response.data;
      
      // Ensure usersData is an array
      if (!Array.isArray(usersData)) {
        // If it's an HTML error response (404, etc.)
        if (typeof usersData === 'string' && usersData.includes('<!DOCTYPE')) {
          throw new Error("Server route not found. Please ensure the backend server is running and the /api/users route is registered.");
        }
        // If it's an object with a message
        if (usersData && usersData.message) {
          throw new Error(usersData.message);
        }
        // Default fallback
        console.warn("Unexpected response format:", usersData);
        usersData = [];
      }
      
      // Transform backend data to frontend format
      const transformedUsers = usersData.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: capitalizeFirst(user.role || "member"),
        status: user.isActive ? "Active" : "Inactive",
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      
      // Handle 401 Unauthorized errors specifically
      if (err.response?.status === 401) {
        const errorMessage = err.response?.data?.message || "You are not authorized to view users. Please log in.";
        setError(errorMessage);
        // Clear auth data and redirect to login
        storageService.clearAuthData();
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Failed to load users";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { 
      key: "status", 
      label: "Status",
      render: (status) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          status === "Active" 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
        }`}>
          {status}
        </span>
      )
    },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-[var(--color-primary-text)] mb-6">
            User Management
          </h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 mb-2">
              Error: {error}
            </p>
            {error.includes("not authenticated") || error.includes("not authorized") ? (
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                Redirecting to login page...
              </p>
            ) : (
              <button
                onClick={fetchUsers}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary-text)] mb-6">
          User Management
        </h1>
        <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md">
          {loading && users.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <DataTable columns={columns} data={users} loading={loading} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
