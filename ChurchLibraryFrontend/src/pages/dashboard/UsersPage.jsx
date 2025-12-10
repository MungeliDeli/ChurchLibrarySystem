import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";

const mockUsers = [
  { id: 1, name: "John Doe", email: "john.doe@church.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane.smith@church.com", role: "Librarian", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob.johnson@church.com", role: "Member", status: "Active" },
  { id: 4, name: "Alice Williams", email: "alice.williams@church.com", role: "Member", status: "Inactive" },
  { id: 5, name: "Charlie Brown", email: "charlie.brown@church.com", role: "Librarian", status: "Active" },
];

const UsersPage = () => {
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

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary-text)] mb-6">
          User Management
        </h1>
        <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md">
          <DataTable columns={columns} data={mockUsers} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
