import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import Button from "../../components/common/Button";
import Grid from "../../components/layout/Grid";

const DashboardPage = () => {
  const stats = [
    { title: "Total Books", value: "1,234", change: "+12%", icon: "📚" },
    { title: "Active Users", value: "456", change: "+8%", icon: "👥" },
    { title: "Books Borrowed", value: "89", change: "+15%", icon: "📖" },
    {
      title: "Overdue Books",
      value: "3",
      change: "-2",
      changeType: "negative",
      icon: "⚠️",
    },
  ];

  const handleQuickAction = (actionId) => {
    console.log("Quick action clicked:", actionId);
    // TODO: Implement quick actions
  };

  const pageActions = [
    <Button key="refresh" variant="outline" size="small">
      Refresh Data
    </Button>,
    <Button key="export" variant="secondary" size="small">
      Export Report
    </Button>,
  ];

  const breadcrumbs = [
    { path: "/dashboard", name: "Dashboard", description: "Go to dashboard" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Dashboard - Phase 7"
          subtitle="Welcome to your Church Library administration panel"
          breadcrumbs={breadcrumbs}
          actions={pageActions}
        />

        {/* Stats Grid */}
        <Grid cols={4} gap="default" responsive>
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid cols={3} gap="default" responsive>
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions onAction={handleQuickAction} />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
