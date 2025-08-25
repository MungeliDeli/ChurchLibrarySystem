import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DataTable from "../../components/common/DataTable";
import ToastContainer from "../../components/common/ToastContainer";

const SettingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const pageActions = [
    <Button key="save" variant="primary" size="small">
      Save Changes
    </Button>,
    <Button key="reset" variant="outline" size="small">
      Reset to Default
    </Button>,
  ];

  const breadcrumbs = [
    { path: "/dashboard", name: "Dashboard", description: "Go to dashboard" },
    {
      path: "/dashboard/settings",
      name: "Settings",
      description: "Application settings",
    },
  ];

  // Sample data for DataTable
  const sampleData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Moderator",
      status: "Inactive",
    },
  ];

  const columns = [
    { key: "name", label: "Name", sortable: true, filterable: true },
    { key: "email", label: "Email", sortable: true, filterable: true },
    { key: "role", label: "Role", sortable: true, filterable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "moderator", label: "Moderator" },
    { value: "user", label: "User" },
  ];

  const handleShowToast = (type) => {
    const messages = {
      success: {
        title: "Success!",
        message: "Operation completed successfully.",
      },
      error: { title: "Error!", message: "Something went wrong." },
      warning: { title: "Warning!", message: "Please check your input." },
      info: { title: "Info", message: "Here's some information for you." },
    };

    window.showToast({
      type,
      ...messages[type],
      duration: 5000,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleShowToast("success");
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Settings - Phase 9"
          subtitle="Configure application preferences and system settings"
          breadcrumbs={breadcrumbs}
          actions={pageActions}
        />

        {/* Phase 9 Component Showcase */}
        <Card>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Settings - Phase 9 Component Showcase
            </h3>
            <p className="text-gray-500 mb-6">
              This page demonstrates all the new Phase 9 common components
            </p>
          </div>
        </Card>

        {/* Component Demonstrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Components */}
          <Card>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Form Components
            </h4>
            <div className="space-y-4">
              <Input
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                leftIcon="👤"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                leftIcon="📧"
                required
              />
              <Select
                label="Role"
                placeholder="Select your role"
                options={roleOptions}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              />
              <div className="flex gap-2">
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Show Confirm Dialog
                </Button>
              </div>
            </div>
          </Card>

          {/* Toast Demonstrations */}
          <Card>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Toast Notifications
            </h4>
            <div className="space-y-2">
              <Button
                variant="success"
                size="small"
                onClick={() => handleShowToast("success")}
              >
                Success Toast
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleShowToast("error")}
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={() => handleShowToast("warning")}
              >
                Warning Toast
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleShowToast("info")}
              >
                Info Toast
              </Button>
            </div>
          </Card>
        </div>

        {/* DataTable Demonstration */}
        <Card>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Data Table Component
          </h4>
          <DataTable
            data={sampleData}
            columns={columns}
            pageSize={5}
            onRowClick={(row) => {
              handleShowToast("info");
              console.log("Row clicked:", row);
            }}
          />
        </Card>

        {/* Settings Features Grid */}
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Application Configuration Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  🎨 Appearance
                </h4>
                <p className="text-sm text-gray-600">
                  Theme, colors, and display preferences
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  🔔 Notifications
                </h4>
                <p className="text-sm text-gray-600">
                  Email and push notification settings
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔐 Security</h4>
                <p className="text-sm text-gray-600">
                  Password policies and authentication
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📊 System</h4>
                <p className="text-sm text-gray-600">
                  Database and performance settings
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📧 Email</h4>
                <p className="text-sm text-gray-600">
                  SMTP configuration and templates
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔄 Backup</h4>
                <p className="text-sm text-gray-600">
                  Data backup and restore options
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Sample Modal"
          size="medium"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Select
              label="Role"
              placeholder="Select your role"
              options={roleOptions}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Modal>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            handleShowToast("success");
            setIsConfirmOpen(false);
          }}
          title="Confirm Action"
          message="Are you sure you want to perform this action? This cannot be undone."
          confirmText="Yes, proceed"
          cancelText="Cancel"
          variant="danger"
        />

        {/* Toast Container */}
        <ToastContainer position="top-right" maxToasts={5} />
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
