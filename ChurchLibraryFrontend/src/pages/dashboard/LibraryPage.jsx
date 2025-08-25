import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const LibraryPage = () => {
  const pageActions = [
    <Button key="add-book" variant="primary" size="small">
      Add New Book
    </Button>,
    <Button key="import" variant="outline" size="small">
      Import Books
    </Button>,
  ];

  const breadcrumbs = [
    { path: "/dashboard", name: "Dashboard", description: "Go to dashboard" },
    {
      path: "/dashboard/library",
      name: "Library",
      description: "Library management",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Library Management"
          subtitle="Manage books, categories, and library operations"
          breadcrumbs={breadcrumbs}
          actions={pageActions}
        />

        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Library Management - Phase 7
            </h3>
            <p className="text-gray-500 mb-4">
              This page will contain comprehensive book management features
              including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📖 Book Catalog
                </h4>
                <p className="text-sm text-gray-600">
                  Add, edit, and manage book entries
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  🏷️ Categories
                </h4>
                <p className="text-sm text-gray-600">
                  Organize books by categories and tags
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📋 Inventory</h4>
                <p className="text-sm text-gray-600">
                  Track book availability and status
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  🔍 Search & Filter
                </h4>
                <p className="text-sm text-gray-600">
                  Advanced search and filtering options
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📊 Reports</h4>
                <p className="text-sm text-gray-600">
                  Generate library activity reports
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">⚙️ Settings</h4>
                <p className="text-sm text-gray-600">
                  Configure library preferences
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LibraryPage;
