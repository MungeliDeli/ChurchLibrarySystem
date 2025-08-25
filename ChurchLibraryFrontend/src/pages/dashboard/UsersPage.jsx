import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const UsersPage = () => {
  const pageActions = [
    <Button key="add-user" variant="primary" size="small">
      Add New User
    </Button>,
    <Button key="import-users" variant="outline" size="small">
      Import Users
    </Button>,
  ];

  const breadcrumbs = [
    { path: "/dashboard", name: "Dashboard", description: "Go to dashboard" },
    { path: "/dashboard/users", name: "Users", description: "User management" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="User Management"
          subtitle="Manage library users and their permissions"
          breadcrumbs={breadcrumbs}
          actions={pageActions}
        />

        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              User Management - Phase 7
            </h3>
            <p className="text-gray-500 mb-4">
              This page will contain comprehensive user management features
              including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  👤 User Profiles
                </h4>
                <p className="text-sm text-gray-600">
                  Create and manage user accounts
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  🔐 Role Management
                </h4>
                <p className="text-sm text-gray-600">
                  Assign roles and permissions
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📋 User Groups
                </h4>
                <p className="text-sm text-gray-600">
                  Organize users into groups
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📊 Activity Tracking
                </h4>
                <p className="text-sm text-gray-600">
                  Monitor user activity and history
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  🔔 Notifications
                </h4>
                <p className="text-sm text-gray-600">
                  Send notifications to users
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📈 User Analytics
                </h4>
                <p className="text-sm text-gray-600">
                  Track user engagement and usage
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
