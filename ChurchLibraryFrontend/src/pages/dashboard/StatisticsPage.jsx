import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const StatisticsPage = () => {
  const pageActions = [
    <Button key="export" variant="primary" size="small">
      Export Report
    </Button>,
    <Button key="schedule" variant="outline" size="small">
      Schedule Report
    </Button>,
  ];

  const breadcrumbs = [
    { path: "/dashboard", name: "Dashboard", description: "Go to dashboard" },
    {
      path: "/dashboard/statistics",
      name: "Statistics",
      description: "Statistics and reports",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Statistics & Reports"
          subtitle="View library analytics and generate reports"
          breadcrumbs={breadcrumbs}
          actions={pageActions}
        />

        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Statistics & Reports - Phase 7
            </h3>
            <p className="text-gray-500 mb-4">
              This page will contain comprehensive analytics and reporting
              features including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📊 Usage Analytics
                </h4>
                <p className="text-sm text-gray-600">
                  Track book borrowing patterns and trends
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  👥 User Statistics
                </h4>
                <p className="text-sm text-gray-600">
                  Monitor user activity and engagement
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📚 Collection Insights
                </h4>
                <p className="text-sm text-gray-600">
                  Analyze popular books and categories
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📅 Time-based Reports
                </h4>
                <p className="text-sm text-gray-600">
                  Monthly, quarterly, and yearly summaries
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📋 Custom Reports
                </h4>
                <p className="text-sm text-gray-600">
                  Generate tailored reports for specific needs
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  📤 Export Options
                </h4>
                <p className="text-sm text-gray-600">
                  Export data in various formats (PDF, Excel, CSV)
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;
